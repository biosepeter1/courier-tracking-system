// Email templates for various notifications

const getEmailHeader = () => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #3b82f6; margin: 0;">📦 Courier Tracking System</h1>
      </div>
`

const getEmailFooter = () => `
    </div>
    <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
      <p>© ${new Date().getFullYear()} Courier Tracking System. All rights reserved.</p>
      <p>This is an automated email, please do not reply directly to this message.</p>
    </div>
  </div>
`

// Shipment Created Email
const shipmentCreatedEmail = (shipmentData, isAdmin = false) => {
  const { trackingNumber, sender, receiver, origin, destination, status, estimatedDelivery } = shipmentData
  
  const subject = `Shipment Created - ${trackingNumber}`
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">
      ${isAdmin ? '🎉 New Shipment Created!' : '✅ Your Shipment Request Has Been Received'}
    </h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      ${isAdmin 
        ? `A new shipment has been created in the system.` 
        : `Thank you for submitting your shipment request. Your package has been registered and is awaiting admin approval.`
      }
    </p>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">
        Tracking Number: ${trackingNumber}
      </p>
    </div>
    
    <div style="margin: 25px 0;">
      <h3 style="color: #111827; margin-bottom: 15px;">Shipment Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <strong>Status:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            <span style="background-color: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 14px;">
              ${status}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <strong>From:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            ${sender.name} (${origin})
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <strong>To:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            ${receiver.name} (${destination})
          </td>
        </tr>
        ${estimatedDelivery ? `
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6;">
            <strong>Est. Delivery:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff;">
            ${new Date(estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </td>
        </tr>
        ` : ''}
      </table>
    </div>
    
    ${!isAdmin ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}" 
         style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Track Your Shipment
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
      You will receive email notifications when your shipment status changes.
    </p>
    ` : ''}
    
    ${getEmailFooter()}
  `
  
  const text = `
    Shipment Created - ${trackingNumber}
    
    Status: ${status}
    From: ${sender.name} (${origin})
    To: ${receiver.name} (${destination})
    ${estimatedDelivery ? `Estimated Delivery: ${new Date(estimatedDelivery).toLocaleDateString()}` : ''}
    
    Track your shipment: ${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}
  `
  
  return { subject, html, text }
}

// Shipment Status Update Email
const shipmentStatusUpdateEmail = (shipmentData, oldStatus) => {
  const { trackingNumber, receiver, status, currentLocation } = shipmentData
  
  const statusColors = {
    'Pending': '#fef3c7',
    'Processing': '#dbeafe',
    'Confirmed': '#dbeafe',
    'Picked Up': '#d1fae5',
    'In Transit': '#bfdbfe',
    'Out for Delivery': '#fde68a',
    'Delivered': '#d1fae5',
    'Cancelled': '#fee2e2'
  }
  
  const statusColor = statusColors[status] || '#f3f4f6'
  
  const subject = `Shipment Update - ${trackingNumber} is now ${status}`
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">📬 Shipment Status Updated</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Your shipment status has been updated.
    </p>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1e40af;">
        Tracking Number: ${trackingNumber}
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; background-color: ${statusColor}; padding: 15px 30px; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Previous Status</p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #111827;">${oldStatus}</p>
      </div>
      <div style="margin: 20px; font-size: 24px; color: #3b82f6;">→</div>
      <div style="display: inline-block; background-color: ${statusColor}; padding: 15px 30px; border-radius: 8px; border: 2px solid #3b82f6;">
        <p style="margin: 0; font-size: 14px; color: #6b7280;">Current Status</p>
        <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #3b82f6;">${status}</p>
      </div>
    </div>
    
    ${currentLocation ? `
    <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0; color: #374151;">
        <strong>📍 Current Location:</strong> ${currentLocation}
      </p>
    </div>
    ` : ''}
    
    ${status === 'Delivered' ? `
    <div style="background-color: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
      <h3 style="color: #047857; margin: 0 0 10px 0;">🎉 Package Delivered!</h3>
      <p style="color: #065f46; margin: 0;">
        Your package has been successfully delivered. Thank you for using our service!
      </p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}" 
         style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Shipment Details
      </a>
    </div>
    
    ${getEmailFooter()}
  `
  
  const text = `
    Shipment Status Updated - ${trackingNumber}
    
    Previous Status: ${oldStatus}
    Current Status: ${status}
    ${currentLocation ? `Current Location: ${currentLocation}` : ''}
    
    Track your shipment: ${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}
  `
  
  return { subject, html, text }
}

// Password Reset Email
const passwordResetEmail = (userName, resetToken) => {
  const resetUrl = `${process.env.ALLOWED_ORIGIN}/reset-password?token=${resetToken}`
  
  const subject = 'Password Reset Request'
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">🔐 Password Reset Request</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hello ${userName},
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        ⚠️ This password reset link will expire in 1 hour.
      </p>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
      If you didn't request this password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <p style="color: #6b7280; font-size: 12px; margin-top: 20px; word-break: break-all;">
      Or copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
    </p>
    
    ${getEmailFooter()}
  `
  
  const text = `
    Password Reset Request
    
    Hello ${userName},
    
    We received a request to reset your password. Click the link below to create a new password:
    
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this password reset, please ignore this email.
  `
  
  return { subject, html, text }
}

// Contact Message Received (to admin)
const contactMessageReceivedEmail = (messageData) => {
  const { name, email, subject: msgSubject, message } = messageData
  
  const subject = `New Contact Message from ${name}`
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">📨 New Contact Message</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      You have received a new message from the contact form.
    </p>
    
    <div style="margin: 25px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb; width: 120px;">
            <strong>From:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <strong>Email:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; background-color: #f3f4f6; border-bottom: 1px solid #e5e7eb;">
            <strong>Subject:</strong>
          </td>
          <td style="padding: 10px; background-color: #ffffff; border-bottom: 1px solid #e5e7eb;">
            ${msgSubject}
          </td>
        </tr>
      </table>
    </div>
    
    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #111827;">Message:</h3>
      <p style="margin: 0; color: #374151; white-space: pre-wrap; line-height: 1.6;">${message}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ALLOWED_ORIGIN}/admin/messages" 
         style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        View in Admin Panel
      </a>
    </div>
    
    ${getEmailFooter()}
  `
  
  const text = `
    New Contact Message from ${name}
    
    Email: ${email}
    Subject: ${msgSubject}
    
    Message:
    ${message}
  `
  
  return { subject, html, text }
}

// Admin Reply Email
const adminReplyEmail = (originalMessage, replyText, adminName) => {
  const { name, subject: originalSubject } = originalMessage
  
  const subject = `Re: ${originalSubject}`
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">💬 Reply from Courier Tracking Support</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hello ${name},
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      ${adminName} has replied to your message:
    </p>
    
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #1e40af; white-space: pre-wrap; line-height: 1.6;">${replyText}</p>
    </div>
    
    <div style="background-color: #f9fafb; border-radius: 6px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #6b7280;"><strong>Your Original Message:</strong></p>
      <p style="margin: 0; color: #6b7280; font-size: 14px; white-space: pre-wrap;">${originalMessage.message}</p>
    </div>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      If you have any further questions, please feel free to contact us again.
    </p>
    
    ${getEmailFooter()}
  `
  
  const text = `
    Reply from Courier Tracking Support
    
    Hello ${name},
    
    ${adminName} has replied to your message:
    
    ${replyText}
    
    ---
    Your Original Message:
    ${originalMessage.message}
  `
  
  return { subject, html, text }
}

// Welcome Email
const welcomeEmail = (userName, userEmail) => {
  const subject = 'Welcome to Courier Tracking System!'
  const html = `
    ${getEmailHeader()}
    <h2 style="color: #111827; margin-bottom: 20px;">🎉 Welcome to Courier Tracking System!</h2>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Hello ${userName},
    </p>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6;">
      Thank you for registering with Courier Tracking System! Your account has been successfully created.
    </p>
    
    <div style="background-color: #d1fae5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #047857; margin: 0 0 15px 0;">✅ Account Created Successfully</h3>
      <p style="color: #065f46; margin: 0;">
        <strong>Email:</strong> ${userEmail}
      </p>
    </div>
    
    <div style="margin: 25px 0;">
      <h3 style="color: #111827; margin-bottom: 15px;">What you can do:</h3>
      <ul style="color: #374151; line-height: 2;">
        <li>📦 Track your shipments in real-time</li>
        <li>🚀 Create new shipment requests</li>
        <li>📊 View shipment history and analytics</li>
        <li>🔔 Receive instant email notifications</li>
        <li>👤 Manage your profile settings</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ALLOWED_ORIGIN}/login" 
         style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Login to Your Account
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
      If you have any questions or need assistance, please don't hesitate to contact our support team.
    </p>
    
    ${getEmailFooter()}
  `
  
  const text = `
    Welcome to Courier Tracking System!
    
    Hello ${userName},
    
    Thank you for registering! Your account has been successfully created.
    
    Email: ${userEmail}
    
    What you can do:
    - Track your shipments in real-time
    - Create new shipment requests
    - View shipment history and analytics
    - Receive instant email notifications
    - Manage your profile settings
    
    Login to your account: ${process.env.ALLOWED_ORIGIN}/login
    
    If you have any questions, please contact our support team.
  `
  
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
