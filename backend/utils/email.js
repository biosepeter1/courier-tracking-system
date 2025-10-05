const nodemailer = require('nodemailer');
const { generateMapsLink } = require('./geocoding');

// Create transporter
let transporter;

const createTransporter = () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    console.log('Email transporter created successfully');
  } catch (error) {
    console.error('Failed to create email transporter:', error);
    transporter = null;
  }
};

// Initialize transporter
createTransporter();

// Send email function
const sendEmail = async (to, subject, text, html = null) => {
  try {
    if (!transporter) {
      console.warn('Email transporter not available, skipping email send');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Courier Service <noreply@courier.com>',
      to,
      subject,
      text,
      ...(html && { html })
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, result.messageId);
    return true;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return false;
  }
};

// Send shipment update notification
const sendShipmentUpdate = async (shipment, checkpoint) => {
  try {
    const { receiver, trackingNumber } = shipment;
    const { status, location, note, updatedAt, coordinates } = checkpoint;

    const subject = `Update: Shipment ${trackingNumber} — ${status}`;
    
    // Generate Google Maps link if coordinates are available
    let mapsLink = '';
    if (coordinates && coordinates.lat && coordinates.lng) {
      mapsLink = generateMapsLink(coordinates.lat, coordinates.lng);
    }

    // Plain text email body
    const textBody = `
Hello ${receiver.name},

Your shipment ${trackingNumber} has an update:

Status: ${status}
Location: ${location}
${note ? `Note: ${note}` : ''}
Time: ${new Date(updatedAt).toLocaleString()}

${mapsLink ? `View location on map: ${mapsLink}` : ''}

Track your shipment: ${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}

Thank you for choosing our courier service!

Best regards,
Your Courier Service Team
    `.trim();

    // HTML email body (enhanced formatting)
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipment Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            background: #10b981; 
            color: white; 
            border-radius: 20px; 
            font-weight: bold;
            margin: 10px 0;
        }
        .info-row { margin: 15px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-left: 10px; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #2563eb; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 15px 5px;
        }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Shipment Update</h1>
            <p>Tracking Number: <strong>${trackingNumber}</strong></p>
        </div>
        
        <div class="content">
            <p>Hello <strong>${receiver.name}</strong>,</p>
            
            <p>Your shipment has a new update:</p>
            
            <div class="status-badge">${status}</div>
            
            <div class="info-row">
                <span class="label">📍 Location:</span>
                <span class="value">${location}</span>
            </div>
            
            ${note ? `
            <div class="info-row">
                <span class="label">📝 Note:</span>
                <span class="value">${note}</span>
            </div>
            ` : ''}
            
            <div class="info-row">
                <span class="label">🕒 Time:</span>
                <span class="value">${new Date(updatedAt).toLocaleString()}</span>
            </div>
            
            <div style="margin: 25px 0;">
                ${mapsLink ? `<a href="${mapsLink}" class="button">📍 View on Google Maps</a>` : ''}
                <a href="${process.env.ALLOWED_ORIGIN}/track/${trackingNumber}" class="button">🔍 Track Shipment</a>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing our courier service!</p>
                <p>Best regards,<br>Your Courier Service Team</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const result = await sendEmail(receiver.email, subject, textBody, htmlBody);
    
    if (result) {
      console.log(`Shipment update notification sent for ${trackingNumber}`);
    } else {
      console.warn(`Failed to send shipment update notification for ${trackingNumber}`);
    }

    return result;
  } catch (error) {
    console.error('Error sending shipment update email:', error);
    return false;
  }
};

// Send welcome email to new users
const sendWelcomeEmail = async (user) => {
  try {
    const subject = 'Welcome to Our Courier Service!';
    
    const textBody = `
Hello ${user.name},

Welcome to our courier service! Your account has been created successfully.

You can now:
- Create and track shipments
- Manage your profile
- Receive real-time updates

Login to your account: ${process.env.ALLOWED_ORIGIN}/login

If you have any questions, please contact our support team.

Best regards,
Your Courier Service Team
    `.trim();

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { 
            display: inline-block; 
            padding: 12px 24px; 
            background: #2563eb; 
            color: white; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
        }
        .features { margin: 20px 0; }
        .feature { margin: 10px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to Our Courier Service!</h1>
        </div>
        
        <div class="content">
            <p>Hello <strong>${user.name}</strong>,</p>
            
            <p>Welcome! Your account has been created successfully.</p>
            
            <div class="features">
                <p><strong>You can now:</strong></p>
                <div class="feature">📦 Create and track shipments</div>
                <div class="feature">👤 Manage your profile</div>
                <div class="feature">🔔 Receive real-time updates</div>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.ALLOWED_ORIGIN}/login" class="button">Login to Your Account</a>
            </div>
            
            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>Best regards,<br>Your Courier Service Team</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const result = await sendEmail(user.email, subject, textBody, htmlBody);
    
    if (result) {
      console.log(`Welcome email sent to ${user.email}`);
    }

    return result;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    if (!transporter) {
      console.warn('Email transporter not configured');
      return false;
    }

    const result = await transporter.verify();
    console.log('Email configuration is valid:', result);
    return true;
  } catch (error) {
    console.error('Email configuration test failed:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendShipmentUpdate,
  sendWelcomeEmail,
  testEmailConfig,
  createTransporter
};