# 📧 Email Setup & Troubleshooting Guide

## ✅ Email Configuration Status

**SMTP Connection:** ✅ Working  
**Test Email:** ✅ Sent Successfully  
**Configuration:** ✅ Complete

Your email service is properly configured with Gmail SMTP!

## 🔧 What Was Fixed

1. **Gmail App Password Handling**: Updated email service to remove spaces from App Passwords
2. **Better Error Logging**: Added detailed console logs for debugging
3. **TLS Configuration**: Added proper TLS settings for Gmail
4. **Admin Email**: Added `ADMIN_EMAIL` to `.env` file

## 📝 Current Configuration

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alliansmart@gmail.com
SMTP_PASS=pdyv tajd scdh wdiv (App Password with spaces - automatically handled)
EMAIL_FROM=Courier Service <alliansmart@gmail.com>
ADMIN_EMAIL=alliansmart@gmail.com
```

## 🚀 How to Activate Email Sending

### Step 1: Restart the Backend Server

**If backend is running:**
1. Stop the backend server (Ctrl+C)
2. Start it again:
   ```bash
   cd C:\Users\user\courier-tracking-system\backend
   npm start
   ```

**You should see this in the console:**
```
📧 Email service configured with SMTP: smtp.gmail.com
   From: Courier Service <alliansmart@gmail.com>
```

### Step 2: Test Email Features

Once the server is restarted, emails will be sent for:

#### 1. **Forgot Password**
- Go to `/login` page
- Click "Forgot your password?"
- Enter email: `alliansmart@gmail.com`
- Check inbox for reset link

#### 2. **Shipment Creation**
- Create a new shipment
- Both sender and receiver will get emails

#### 3. **Shipment Status Update**
- Update a shipment status
- Both sender and receiver will get update emails

#### 4. **Contact Messages**
- Submit a message via `/contact` page
- Admin email receives notification

#### 5. **Admin Replies**
- Admin replies to a message in `/admin/messages`
- User receives the reply via email

## 🔍 Email Logs

When emails are sent, you'll see detailed logs in the backend console:

### Successful Email:
```
📧 Sending email to user@example.com...
✅ Email sent successfully: {
  to: 'user@example.com',
  subject: 'Shipment Created - CTS12345',
  messageId: '<abc123@gmail.com>',
  response: '250 2.0.0 OK'
}
```

### Failed Email:
```
❌ Email sending failed:
   Error: Invalid login credentials
   Code: EAUTH
```

## 🛠️ Test Email Script

A test script has been created to verify SMTP configuration:

```bash
cd C:\Users\user\courier-tracking-system\backend
node test-email.js
```

This will:
- Verify SMTP connection
- Send a test email to your Gmail
- Show detailed error messages if anything fails

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid login credentials"
**Solution:** 
- Make sure you're using a Gmail App Password (not your regular password)
- Go to: https://myaccount.google.com/apppasswords
- Generate a new App Password

### Issue 2: Emails not received
**Possible causes:**
1. Backend server not restarted after configuration changes
2. Check Gmail spam/junk folder
3. Gmail may delay emails (check after 1-2 minutes)

### Issue 3: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify firewall isn't blocking port 587
- Try port 465 with `secure: true`

## 📋 Email Templates Available

The system includes professional HTML email templates for:

1. **Shipment Created** - Welcome email with tracking number
2. **Shipment Status Update** - Status change notifications with timeline
3. **Password Reset** - Secure reset link (expires in 1 hour)
4. **Contact Message Received** - Notification to admin
5. **Admin Reply** - Response to user's contact message

All templates include:
- Professional HTML styling
- Mobile-responsive design
- Clear call-to-action buttons
- Company branding
- Footer with unsubscribe info

## 🔐 Security Notes

- Password reset tokens expire after 1 hour
- Tokens are hashed before storage in database
- Gmail App Passwords are more secure than regular passwords
- SMTP password is never logged (only shows ***configured***)

## 📞 Need Help?

If emails are still not working after restarting:

1. Run the test script: `node test-email.js`
2. Check the backend console for error messages
3. Verify Gmail account settings
4. Make sure 2-Factor Authentication is enabled
5. Regenerate a new App Password if needed

---

**Status:** ✅ Email service is fully configured and tested  
**Last Test:** Successful (check your inbox at alliansmart@gmail.com)
