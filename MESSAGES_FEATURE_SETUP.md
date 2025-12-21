# Messages Feature Implementation Summary

## Overview
This document describes the new messaging features added to the Autolity marketplace, including Contact Seller functionality, inbox, chat, and mobile hamburger menu.

## Features Implemented

### 1. Contact Seller Functionality
- **Contact Seller button** added to each posting card on Marketplace page
- **Contact Seller button** added to posting detail page
- **Modal form** for sending messages with fields:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Message (required)
- Messages are saved to database and email notifications are sent to sellers

### 2. Messages Inbox Page
- New `messages.html` page showing all received messages
- Messages grouped by posting
- Shows latest message preview, sender info, and timestamp
- Click a message to open chat conversation

### 3. Chat Functionality
- Chat modal opens when clicking a message in inbox
- Shows full conversation history for a posting
- Reply functionality within chat modal
- Messages displayed in conversation format (sent/received)

### 4. Mobile Hamburger Menu
- Responsive navigation menu for mobile devices
- Hamburger icon appears on screens < 768px
- Smooth slide-down animation
- Auto-closes when clicking outside or selecting a link

## Files Created/Modified

### New Files
1. **CREATE_MESSAGES_TABLE.sql** - SQL script to create messages table in Supabase
2. **messages-api.js** - Frontend API functions for messages
3. **messages.html** - Inbox and chat page

### Modified Files
1. **package.json** - Added `nodemailer` dependency
2. **server.js** - Added:
   - Messages table initialization
   - Email configuration (Nodemailer/SendGrid)
   - POST /api/messages - Create message and send email
   - GET /api/messages/inbox - Get received messages
   - GET /api/messages/conversation/:postingId - Get conversation
3. **marketplace-api.js** - Added Contact Seller button to product cards
4. **marketplace.html** - Added Contact Seller modal and hamburger menu
5. **posting-detail.html** - Added Contact Seller modal and hamburger menu
6. **styles.css** - Added mobile hamburger menu styles

## Setup Instructions

### 1. Database Setup
Run the SQL script in your Supabase SQL editor:
```sql
-- Run CREATE_MESSAGES_TABLE.sql in Supabase Dashboard → SQL Editor
```

### 2. Install Dependencies
```bash
npm install
```
This will install `nodemailer` for email sending.

### 3. Email Configuration (Railway Environment Variables)

Choose one of the following email options:

#### Option A: SendGrid (Recommended)
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@autoilty.com
FROM_NAME=Autolity Marketplace
FRONTEND_URL=https://autoilty.com
```

#### Option B: SMTP (Gmail, custom SMTP)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Autolity Marketplace
FRONTEND_URL=https://autoilty.com
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in `SMTP_PASS`

### 4. Deploy Backend
```bash
git add .
git commit -m "Add messaging features: Contact Seller, inbox, chat, mobile menu"
git push
```

Railway will automatically redeploy with the new routes.

### 5. Test the Features

1. **Contact Seller:**
   - Go to Marketplace page
   - Click "Contact Seller" on any posting
   - Fill out the form and submit
   - Check seller's email inbox

2. **Messages Inbox:**
   - Login as a seller
   - Go to Messages page (or click Messages in user menu)
   - View received messages

3. **Chat:**
   - Click any message in inbox
   - View conversation and reply

4. **Mobile Menu:**
   - Resize browser to < 768px width
   - Click hamburger icon
   - Menu should slide down

## API Endpoints

### POST /api/messages
Create a new message and send email notification.

**Request Body:**
```json
{
  "postingId": 123,
  "toUserId": 456,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "message": "Is this still available?"
}
```

**Response:**
```json
{
  "message": "Message sent successfully",
  "messageId": 789
}
```

### GET /api/messages/inbox
Get all messages received by the logged-in user.

**Response:**
```json
{
  "messages": [
    {
      "id": 1,
      "postingId": 123,
      "postingTitle": "2020 Honda Civic",
      "fromName": "John Doe",
      "fromEmail": "john@example.com",
      "message": "Is this still available?",
      "createdAt": "2025-12-17T10:00:00Z"
    }
  ]
}
```

### GET /api/messages/conversation/:postingId
Get full conversation for a specific posting.

**Response:**
```json
{
  "posting": {
    "id": 123,
    "title": "2020 Honda Civic",
    "price": 15000
  },
  "messages": [
    {
      "id": 1,
      "fromName": "John Doe",
      "message": "Is this still available?",
      "isFromMe": false,
      "createdAt": "2025-12-17T10:00:00Z"
    }
  ]
}
```

## Database Schema

### messages table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER NOT NULL,
  to_user_id INTEGER NOT NULL,
  posting_id INTEGER NOT NULL,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE
);
```

## Notes

- Email sending fails gracefully - messages are still saved even if email fails
- In development mode, emails are logged to console instead of being sent
- Mobile hamburger menu works on all pages that include the navigation
- Messages require authentication - users must be logged in to send/receive
- Contact Seller button redirects to login if user is not authenticated

## Troubleshooting

### Emails not sending
1. Check Railway environment variables are set correctly
2. Verify SendGrid API key or SMTP credentials
3. Check Railway logs for email errors
4. In development, emails are logged to console

### Messages not appearing
1. Verify messages table exists in Supabase
2. Check user is logged in
3. Verify API routes are deployed correctly
4. Check browser console for errors

### Mobile menu not working
1. Ensure styles.css is loaded
2. Check nav-toggle button exists in HTML
3. Verify JavaScript is running (check console)
4. Test on actual mobile device or browser dev tools

## Next Steps (Optional Enhancements)

- Add real-time notifications for new messages
- Add message read/unread status
- Add message search/filtering
- Add email templates for better formatting
- Add SMS notifications (Twilio integration)

