const nodemailer = require('nodemailer')
const sgMail = require('@sendgrid/mail')

// Create transporter
let transporter = null
let useSendGridAPI = false

const createTransporter = () => {
  // Check if SendGrid API key is provided (preferred for production)
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    useSendGridAPI = true
    console.log('📧 Email service configured with SendGrid Web API')
    console.log(`   From: ${process.env.EMAIL_FROM}`)
    return null // No nodemailer transporter needed
  }
  
  // Fallback to SMTP if no SendGrid API key
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    useSendGridAPI = false
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s+/g, '')
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    console.log(`📧 Email service configured with SMTP: ${process.env.SMTP_HOST}`)
    console.log(`   From: ${process.env.EMAIL_FROM}`)
    return transporter
  }
  
  // No email service configured
  console.log('📧 Email service running in TEST mode (emails will be logged, not sent)')
  console.log('   To send real emails, configure SENDGRID_API_KEY or SMTP credentials in .env')
  return null
}

// Initialize transporter
const getTransporter = () => {
  if (!transporter) {
    createTransporter()
  }
  return transporter
}

// Send email function
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Initialize if not already done
    if (!transporter && !useSendGridAPI) {
      createTransporter()
    }
    
    // Use SendGrid Web API if configured
    if (useSendGridAPI) {
      console.log(`📧 Sending email via SendGrid API to ${to}...`)
      
      const msg = {
        to,
        from: process.env.EMAIL_FROM || 'Courier Tracking System <noreply@courier.com>',
        subject,
        text,
        html
      }
      
      const response = await sgMail.send(msg)
      
      console.log('✅ Email sent successfully via SendGrid API:', {
        to,
        subject,
        statusCode: response[0].statusCode
      })
      
      return { success: true, messageId: response[0].headers['x-message-id'] }
    }
    
    // Test mode - no email service configured
    if (!transporter) {
      console.log('📧 [TEST MODE] Email would be sent:')
      console.log(`   To: ${to}`)
      console.log(`   Subject: ${subject}`)
      console.log(`   From: ${process.env.EMAIL_FROM || 'Courier Tracking System'}`)
      console.log('   (Configure SENDGRID_API_KEY or SMTP credentials in .env to send real emails)')
      return { success: true, messageId: 'test-mode', testMode: true }
    }
    
    // Use SMTP via Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Courier Tracking System" <noreply@courier.com>',
      to,
      subject,
      text,
      html
    }

    console.log(`📧 Sending email via SMTP to ${to}...`)
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully via SMTP:', {
      to,
      subject,
      messageId: info.messageId,
      response: info.response
    })
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email sending failed:')
    console.error('   Error:', error.message)
    console.error('   Code:', error.code)
    if (error.command) {
      console.error('   Command:', error.command)
    }
    return { success: false, error: error.message }
  }
}

module.exports = {
  sendEmail,
  getTransporter
}
