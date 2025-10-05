require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('=== Email Configuration Test ===\n');
console.log('SMTP Configuration:');
console.log('  Host:', process.env.SMTP_HOST);
console.log('  Port:', process.env.SMTP_PORT);
console.log('  User:', process.env.SMTP_USER);
console.log('  Password:', process.env.SMTP_PASS ? '***configured***' : 'NOT SET');
console.log('  From:', process.env.EMAIL_FROM);
console.log('\n');

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
  console.error('❌ SMTP credentials not fully configured in .env file');
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS.replace(/\s+/g, '') // Remove any spaces
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test connection
console.log('Testing SMTP connection...\n');
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP Connection Failed:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('\n');
    console.log('Common Issues:');
    console.log('  1. Gmail: Make sure "Less secure app access" is enabled OR use an App Password');
    console.log('  2. Check if your password has spaces (App Passwords from Gmail have spaces)');
    console.log('  3. Verify the email/password are correct');
    console.log('  4. Check if 2-Factor Authentication is enabled (use App Password)');
  } else {
    console.log('✅ SMTP Connection Successful!\n');
    
    // Send test email
    console.log('Sending test email...\n');
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.SMTP_USER, // Send to yourself
      subject: 'Test Email from Courier Tracking System',
      text: 'This is a test email to verify SMTP configuration is working correctly.',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration is working correctly.</p>'
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:');
        console.error('   Error:', error.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log('   Response:', info.response);
        console.log('\nCheck your inbox at:', process.env.SMTP_USER);
      }
      process.exit(error ? 1 : 0);
    });
  }
});
