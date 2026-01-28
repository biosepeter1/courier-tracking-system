// Premium, Professional Email Templates
// Design System: Clean Corporate, Minimalist, Blue/Black/White Palette

// Shared Styles & Components
const theme = {
  colors: {
    primary: '#2563eb', // Blue-600
    primaryDark: '#1e40af', // Blue-800
    secondary: '#111827', // Gray-900
    text: '#374151', // Gray-700
    textLight: '#6b7280', // Gray-500
    bg: '#f3f4f6', // Gray-100
    white: '#ffffff',
    border: '#e5e7eb', // Gray-200
    success: '#10b981', // Emerald-500
    successBg: '#d1fae5', // Emerald-100
    warning: '#f59e0b', // Amber-500
    warningBg: '#fef3c7', // Amber-100
    error: '#ef4444', // Red-500
    errorBg: '#fee2e2', // Red-100
  }
}

const getEmailHeader = (title = 'Courier Tracking System') => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <style type="text/css">
      body, table, td, a {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
  </head>
  <body style="margin: 0; padding: 0; background-color: ${theme.colors.bg}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${theme.colors.bg};">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Main Container -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: ${theme.colors.white}; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 30px 40px; border-bottom: 1px solid ${theme.colors.border}; background: linear-gradient(to right, #ffffff, #f9fafb);">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="left">
                       <span style="font-size: 24px; font-weight: 800; color: ${theme.colors.secondary}; letter-spacing: -0.5px;">
                        📦 Courier<span style="color: ${theme.colors.primary};">System</span>
                      </span>
                    </td>
                    <td align="right">
                      <span style="font-size: 14px; color: ${theme.colors.textLight}; font-weight: 500;">
                        ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Content Area -->
            <tr>
              <td style="padding: 40px;">
`

const getEmailFooter = () => `
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 30px 40px; border-top: 1px solid ${theme.colors.border};">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <a href="${process.env.ALLOWED_ORIGIN}" style="display: inline-block; margin: 0 10px; color: ${theme.colors.textLight}; text-decoration: none; font-size: 14px;">Home</a>
                      <a href="${process.env.ALLOWED_ORIGIN}/track" style="display: inline-block; margin: 0 10px; color: ${theme.colors.textLight}; text-decoration: none; font-size: 14px;">Track Package</a>
                      <a href="${process.env.ALLOWED_ORIGIN}/contact" style="display: inline-block; margin: 0 10px; color: ${theme.colors.textLight}; text-decoration: none; font-size: 14px;">Support</a>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        © ${new Date().getFullYear()} Courier Tracking System. All rights reserved.<br>
                        123 Logistics Way, Transport City, TC 90210
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <!-- Space below card -->
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
             <tr><td height="40"></td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`

// Helper for status badges
const getStatusBadge = (status) => {
  const styles = {
    'Pending': { bg: '#fff7ed', color: '#c2410c', border: '#ffedd5' },
    'Processing': { bg: '#eff6ff', color: '#1d4ed8', border: '#dbeafe' },
    'Confirmed': { bg: '#eef2ff', color: '#4338ca', border: '#e0e7ff' },
    'Picked Up': { bg: '#f0fdf4', color: '#15803d', border: '#dcfce7' },
    'In Transit': { bg: '#f5f3ff', color: '#7c3aed', border: '#ede9fe' },
    'Out for Delivery': { bg: '#fffbeb', color: '#b45309', border: '#fef3c7' },
    'Delivered': { bg: '#ecfdf5', color: '#047857', border: '#d1fae5' },
    'Cancelled': { bg: '#fef2f2', color: '#b91c1c', border: '#fee2e2' },
  }
  const style = styles[status] || styles['Pending']

  return `
    <span style="
      display: inline-block;
      padding: 6px 12px;
      background-color: ${style.bg};
      color: ${style.color};
      border: 1px solid ${style.border};
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    ">
      ${status}
    </span>
  `
}

// 1. Shipment Created Email
const shipmentCreatedEmail = (shipmentData, isAdmin = false) => {
  const { trackingNumber, sender, receiver, origin, destination, status, estimatedDelivery } = shipmentData
  const subject = isAdmin ? `New Shipment Created - ${trackingNumber}` : `Shipment Confirmed - ${trackingNumber}`

  const html = `
    ${getEmailHeader(subject)}
    
    <h1 style="margin: 0 0 24px; font-size: 24px; font-weight: 700; color: ${theme.colors.secondary}; text-align: center;">
      ${isAdmin ? 'New Shipment Request' : 'Shipment Registered Successfully'}
    </h1>
    
    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: ${theme.colors.text}; text-align: center;">
      ${isAdmin
      ? 'A new shipment has been created and requires your attention.'
      : 'Your shipment has been successfully registered in our system. We will update you as soon as it begins its journey.'}
    </p>

    <!-- Tracking Number Box -->
    <div style="background-color: ${theme.colors.bg}; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px; border: 1px solid ${theme.colors.border};">
      <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.colors.textLight}; font-weight: 600;">Tracking Number</p>
      <p style="margin: 0; font-size: 28px; font-weight: 700; color: ${theme.colors.primary}; font-family: monospace; letter-spacing: 2px;">${trackingNumber}</p>
    </div>

    <!-- Details Grid -->
    <div style="margin-bottom: 32px;">
      <h3 style="margin: 0 0 16px; font-size: 14px; font-weight: 600; text-transform: uppercase; color: ${theme.colors.textLight}; letter-spacing: 0.5px; border-bottom: 1px solid ${theme.colors.border}; padding-bottom: 10px;">Shipment Details</h3>
      
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td width="50%" valign="top" style="padding-right: 12px; padding-bottom: 20px;">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${theme.colors.textLight};">From</p>
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${theme.colors.secondary};">${sender.name}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: ${theme.colors.text}; line-height: 1.4;">${origin}</p>
          </td>
          <td width="50%" valign="top" style="padding-left: 12px; padding-bottom: 20px;">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${theme.colors.textLight};">To</p>
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${theme.colors.secondary};">${receiver.name}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: ${theme.colors.text}; line-height: 1.4;">${destination}</p>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding-bottom: 20px;">
            <p style="margin: 0 0 8px; font-size: 12px; color: ${theme.colors.textLight};">Current Status</p>
            ${getStatusBadge(status)}
          </td>
        </tr>
        ${estimatedDelivery ? `
        <tr>
          <td colspan="2">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${theme.colors.textLight};">Estimated Delivery</p>
            <p style="margin: 0; font-size: 15px; font-weight: 500; color: ${theme.colors.secondary};">
              ${new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </td>
        </tr>
        ` : ''}
      </table>
    </div>

    ${!isAdmin ? `
    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}" 
             style="display: inline-block; background-color: ${theme.colors.primary}; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Track Shipment
          </a>
        </td>
      </tr>
    </table>
    ` : ''}

    ${getEmailFooter()}
  `

  const text = `Shipment Created - ${trackingNumber}\n\nStatus: ${status}\nFrom: ${sender.name} (${origin})\nTo: ${receiver.name} (${destination})\n\nTrack: ${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}`

  return { subject, html, text }
}

// 2. Shipment Status Update Email
const shipmentStatusUpdateEmail = (shipmentData, oldStatus) => {
  const { trackingNumber, status, currentLocation } = shipmentData
  const subject = `Update: Shipment ${trackingNumber} is ${status}`

  const html = `
    ${getEmailHeader(subject)}

    <div style="text-align: center; margin-bottom: 32px;">
      ${getStatusBadge(status)}
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: ${theme.colors.secondary}; text-align: center;">
      Shipment Status Updated
    </h1>

    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: ${theme.colors.text}; text-align: center;">
      Your shipment <span style="font-family: monospace; font-weight: 700; color: ${theme.colors.secondary}; background: ${theme.colors.bg}; padding: 2px 4px; border-radius: 4px;">${trackingNumber}</span> has moved to a new stage.
    </p>

    <!-- Progress Visualization -->
    <div style="background-color: ${theme.colors.bg}; border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px solid ${theme.colors.border};">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td align="center" width="40%">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${theme.colors.textLight}; text-transform: uppercase;">Previous</p>
            <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${theme.colors.textLight};">${oldStatus}</p>
          </td>
          <td align="center" width="20%">
            <span style="font-size: 20px; color: ${theme.colors.primary};">➜</span>
          </td>
          <td align="center" width="40%">
            <p style="margin: 0 0 4px; font-size: 12px; color: ${theme.colors.secondary}; font-weight: 700; text-transform: uppercase;">New Status</p>
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: ${theme.colors.primary};">${status}</p>
          </td>
        </tr>
      </table>
    </div>

    ${currentLocation ? `
    <div style="margin-bottom: 32px; padding: 16px; background-color: #f8fafc; border-left: 4px solid ${theme.colors.primary}; border-radius: 0 4px 4px 0;">
      <p style="margin: 0; font-size: 14px; color: ${theme.colors.text};">
        <strong style="color: ${theme.colors.secondary};">📍 Current Location:</strong> ${currentLocation}
      </p>
    </div>
    ` : ''}

    ${status === 'Delivered' ? `
    <div style="background-color: ${theme.colors.successBg}; border: 1px solid ${theme.colors.success}; padding: 20px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
      <h3 style="margin: 0 0 8px; color: ${theme.colors.success}; font-size: 18px;">Package Delivered</h3>
      <p style="margin: 0; color: #064e3b; font-size: 14px;">We hope you enjoy your package! Thank you for choosing our service.</p>
    </div>
    ` : ''}

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}" 
             style="display: inline-block; background-color: ${theme.colors.secondary}; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            View Detailed History
          </a>
        </td>
      </tr>
    </table>

    ${getEmailFooter()}
  `

  const text = `Update: Shipment ${trackingNumber} is ${status}.\n\nPrevious: ${oldStatus}\nNew: ${status}\nLocation: ${currentLocation || 'N/A'}\n\nTrack: ${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}`

  return { subject, html, text }
}

// 3. Password Reset Email
const passwordResetEmail = (userName, resetToken) => {
  const resetUrl = `${process.env.ALLOWED_ORIGIN}/reset-password?token=${resetToken}`
  const subject = 'Action Required: Reset Your Password'

  const html = `
    ${getEmailHeader(subject)}

    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 24px; background-color: ${theme.colors.bg}; color: ${theme.colors.secondary}; font-size: 24px;">🔐</span>
    </div>

    <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: ${theme.colors.secondary}; text-align: center;">
      Reset Your Password
    </h1>

    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: ${theme.colors.text}; text-align: center;">
      Hello ${userName}, we received a request to change your password. If you didn't make this request, you can safely ignore this email.
    </p>

    <!-- CTA Button -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
      <tr>
        <td align="center">
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: ${theme.colors.primary}; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Reset My Password
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: ${theme.colors.warningBg}; padding: 16px; border-radius: 6px; border: 1px solid ${theme.colors.warning}; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 13px; color: ${theme.colors.secondary};">
        <strong>Note:</strong> This link will expire in 60 minutes for your security.
      </p>
    </div>

    <p style="margin: 0; font-size: 13px; color: ${theme.colors.textLight}; text-align: center; word-break: break-all;">
      Or copy this link:<br>
      <a href="${resetUrl}" style="color: ${theme.colors.primary};">${resetUrl}</a>
    </p>

    ${getEmailFooter()}
  `

  const text = `Reset Password: ${resetUrl}\nLink expires in 1 hour.`

  return { subject, html, text }
}

// 4. Contact Message (Admin)
const contactMessageReceivedEmail = (messageData) => {
  const { name, email, subject: msgSubject, message } = messageData
  const subject = `New Inquiry: ${msgSubject}`

  const html = `
    ${getEmailHeader(subject)}

    <h1 style="margin: 0 0 24px; font-size: 22px; font-weight: 700; color: ${theme.colors.secondary};">
      New Contact Message
    </h1>

    <div style="background-color: ${theme.colors.bg}; padding: 24px; border-radius: 8px; margin-bottom: 24px; border: 1px solid ${theme.colors.border};">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; margin-bottom: 12px;">
            <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: ${theme.colors.textLight}; text-transform: uppercase;">From</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: ${theme.colors.secondary};">${name}</p>
            <a href="mailto:${email}" style="color: ${theme.colors.primary}; font-size: 14px; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr>
           <td style="padding-top: 16px;">
             <p style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: ${theme.colors.textLight}; text-transform: uppercase;">Message</p>
             <p style="margin: 0; font-size: 15px; line-height: 1.6; color: ${theme.colors.text}; white-space: pre-wrap;">${message}</p>
           </td>
        </tr>
      </table>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${process.env.ALLOWED_ORIGIN}/admin/messages" 
             style="display: inline-block; background-color: ${theme.colors.secondary}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">
            View in Admin Dashboard
          </a>
        </td>
      </tr>
    </table>

    ${getEmailFooter()}
  `

  const text = `New Message from ${name} (${email})\nSubject: ${msgSubject}\n\n${message}`

  return { subject, html, text }
}

// 5. Admin Reply
const adminReplyEmail = (originalMessage, replyText, adminName) => {
  const { name, subject: originalSubject } = originalMessage
  const subject = `Re: ${originalSubject}`

  const html = `
    ${getEmailHeader(subject)}
    
    <p style="margin: 0 0 16px; font-size: 16px; color: ${theme.colors.text};">
      Dear ${name},
    </p>
    
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: ${theme.colors.text};">
      Thank you for contacting us. We have received your inquiry.
    </p>

    <div style="background-color: ${theme.colors.bg}; border-left: 4px solid ${theme.colors.primary}; padding: 20px; margin-bottom: 32px; border-radius: 0 4px 4px 0;">
      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: ${theme.colors.primary}; text-transform: uppercase;">Response from ${adminName}</p>
      <p style="margin: 0; font-size: 16px; line-height: 1.6; color: ${theme.colors.secondary}; white-space: pre-wrap;">${replyText}</p>
    </div>

    <div style="border-top: 1px solid ${theme.colors.border}; padding-top: 24px; margin-top: 32px;">
      <p style="margin: 0 0 8px; font-size: 12px; color: ${theme.colors.textLight}; text-transform: uppercase; font-weight: 600;">Original Inquriy</p>
      <p style="margin: 0; font-size: 14px; color: ${theme.colors.textLight}; font-style: italic;">"${originalMessage.message}"</p>
    </div>

    ${getEmailFooter()}
  `

  const text = `Response to your inquiry:\n\n${replyText}\n\n--\nOriginal: ${originalMessage.message}`

  return { subject, html, text }
}

// 6. Welcome Email
const welcomeEmail = (userName, userEmail) => {
  const subject = 'Welcome to Courier Tracking System'

  const html = `
    ${getEmailHeader(subject)}

    <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 700; color: ${theme.colors.secondary}; text-align: center;">
      Welcome Aboard! 🎉
    </h1>
    
    <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: ${theme.colors.text}; text-align: center;">
      Thanks for joining Courier Tracking System. We're excited to have you on board.
    </p>
    
    <div style="background-color: ${theme.colors.bg}; padding: 24px; border-radius: 8px; margin-bottom: 32px;">
       <h3 style="margin: 0 0 16px; font-size: 16px; font-weight: 700; color: ${theme.colors.secondary};">Get Started with your new account:</h3>
       
       <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
         <tr>
           <td style="padding-bottom: 12px;">✅ <strong>Real-time Tracking:</strong> Monitor your shipments 24/7.</td>
         </tr>
         <tr>
            <td style="padding-bottom: 12px;">📦 <strong>Easy Management:</strong> Create and manage shipments easily.</td>
         </tr>
         <tr>
            <td>🔔 <strong>Instant Alerts:</strong> Get notified on every status update.</td>
         </tr>
       </table>
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center">
          <a href="${process.env.ALLOWED_ORIGIN}/login" 
             style="display: inline-block; background-color: ${theme.colors.primary}; color: #ffffff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Access Dashboard
          </a>
        </td>
      </tr>
    </table>

    ${getEmailFooter()}
  `

  const text = `Welcome ${userName}! Login to your account: ${process.env.ALLOWED_ORIGIN}/login`

  return { subject, html, text }
}

module.exports = {
  shipmentCreatedEmail,
  shipmentStatusUpdateEmail,
  passwordResetEmail,
  contactMessageReceivedEmail,
  adminReplyEmail,
  welcomeEmail
}
