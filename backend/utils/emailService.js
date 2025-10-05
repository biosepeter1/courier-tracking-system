const nodemailer = require('nodemailer')

// Create transporter
let transporter = null

const createTransporter = () => {
  // For development, use Ethereal (test email service)
  // For production, use real SMTP credentials from .env
  
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Production transporter with Gmail support
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS.replace(/\s+/g, '') // Remove spaces from App Password
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    })
    console.log(`📧 Email service configured with SMTP: ${process.env.SMTP_HOST}`)
    console.log(`   From: ${process.env.EMAIL_FROM}`)
  } else {
    // Development: Create test account
    console.log('📧 Email service running in TEST mode (emails will be logged, not sent)')
    console.log('   To send real emails, configure SMTP_HOST, SMTP_USER, and SMTP_PASS in .env')
    transporter = null // Don't create transporter in test mode
  }
  
  return transporter
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
    const transporter = getTransporter()
    
    // If no transporter (test mode), just log the email
    if (!transporter) {
      console.log('📧 [TEST MODE] Email would be sent:')
      console.log(`   To: ${to}`)
      console.log(`   Subject: ${subject}`)
      console.log(`   From: ${process.env.EMAIL_FROM || 'Courier Tracking System'}`)
      console.log('   (Configure SMTP in .env to send real emails)')
      return { success: true, messageId: 'test-mode', testMode: true }
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Courier Tracking System" <noreply@courier.com>',
      to,
      subject,
      text,
      html
    }

    console.log(`📧 Sending email to ${to}...`)
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Email sent successfully:', {
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
