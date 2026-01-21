# Real-Time Notifications System Setup Guide

## Overview
This document explains how to set up and use the real-time notification system for Autoilty.com. The system provides instant in-app notifications when users receive messages or have questions posted on their listings.

## Features
- ✅ Real-time notification bell with unread count badge
- ✅ Notification dropdown with list of notifications
- ✅ Mark individual or all notifications as read
- ✅ Click notification to navigate to relevant page
- ✅ Automatic polling for new notifications (30-second interval)
- ✅ Support for multiple notification types (messages, questions, etc.)
- ✅ Mobile-responsive design

## Setup Steps

### 1. Database Setup
Run the SQL migration to create the notifications table:

```bash
# In Supabase SQL Editor, run:
CREATE_NOTIFICATIONS_TABLE.sql
```

This creates:
- `notifications` table with all necessary columns
- Indexes for performance
- Row Level Security (RLS) policies

### 2. Server-Side Setup
The notification system is already integrated into `server.js`:

- Notification triggers are added to the messages endpoint
- API routes are created at `/api/notifications/*`
- Helper functions in `api/notifications.js`

### 3. Client-Side Setup
Add the following script tags to your HTML pages (in the `<head>` section, after other scripts):

```html
<script src="js/notifications-api.js"></script>
<script src="js/notifications-system.js"></script>
```

### 4. Add Notification Bell to Navigation
Add the notification bell HTML to your navigation (after cart-toggle, before user-menu):

```html
<!-- Notification Bell (shown when authenticated) -->
<button 
  class="notification-toggle" 
  id="notificationToggle" 
  aria-label="Notifications"
  style="position: relative; padding: var(--spacing-xs); color: var(--color-text); background: none; border: none; cursor: pointer; transition: opacity 0.2s; display: none;"
>
  <i data-lucide="bell" style="width: 1.5rem; height: 1.5rem;"></i>
  <span 
    class="notification-badge" 
    id="notificationBadge" 
    style="display: none; position: absolute; top: 0; right: 0; background: var(--color-primary); color: white; border-radius: 10px; padding: 2px 6px; font-size: 0.75rem; font-weight: 600; min-width: 18px; text-align: center; transform: translate(25%, -25%); line-height: 1.2; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"
  >0</span>
</button>
```

Also add the notification dropdown and overlay (after the navigation, before main content):

See `components/notification-bell.html` for the complete HTML structure.

### 5. Update Navigation Setup Function
In your navigation setup function (where you show/hide user menu), add:

```javascript
// Show notification bell when authenticated
const notificationToggle = document.getElementById('notificationToggle');
if (notificationToggle && currentUser && isAuthenticated()) {
  notificationToggle.style.display = 'block';
  
  // Initialize notification system
  if (window.notificationSystem && !window.notificationSystem.isInitialized) {
    window.notificationSystem.init();
  }
  
  // Setup notification toggle button
  notificationToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.notificationSystem) {
      window.notificationSystem.toggleDropdown();
    }
  });
} else if (notificationToggle) {
  notificationToggle.style.display = 'none';
}
```

## API Endpoints

### GET /api/notifications
Get user notifications (requires authentication)

**Query Parameters:**
- `limit` (optional, default: 50) - Number of notifications to return
- `offset` (optional, default: 0) - Pagination offset
- `unreadOnly` (optional, default: false) - Only return unread notifications

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": 123,
      "type": "message",
      "title": "New message from John",
      "body": "Hello, I'm interested in...",
      "link": "messages.html?userId=456",
      "related_id": 789,
      "related_type": "message",
      "read_at": null,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /api/notifications/unread-count
Get unread notification count (requires authentication)

**Response:**
```json
{
  "unreadCount": 5
}
```

### PUT /api/notifications/:id/read
Mark a specific notification as read (requires authentication)

**Response:**
```json
{
  "message": "Notification marked as read"
}
```

### PUT /api/notifications/read-all
Mark all notifications as read (requires authentication)

**Response:**
```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

## How It Works

### Message Notifications
When a user sends a message via `/api/messages`, the server:
1. Creates the message in the database
2. Automatically creates a notification for the recipient
3. Notification includes:
   - Title: "New message from [sender name]"
   - Body: Preview of message (first 100 chars)
   - Link: URL to the messages page with conversation context

### Notification Polling
The client-side system:
- Polls for unread count every 30 seconds
- Occasionally polls for full notifications (30% chance)
- Updates UI automatically when new notifications arrive

### Notification Types
Currently supported:
- `message` - Private messages between users
- `question` - Public questions on listings (future feature)
- `posting_update` - Updates to postings (future feature)
- `system` - System notifications (future feature)

## Customization

### Change Polling Interval
Edit `js/notifications-system.js`:
```javascript
this.pollIntervalMs = 30000; // Change to desired milliseconds
```

### Customize Notification Icons
Edit the `renderDropdown()` method in `js/notifications-system.js`:
```javascript
let icon = 'message-circle';
if (notification.type === 'question') icon = 'help-circle';
// Add more icon mappings...
```

### Add Toast Notifications
You can add toast notifications on new notifications by subscribing to the callback:

```javascript
window.notificationSystem.onNewNotification((notification) => {
  // Show toast notification
  showToast(notification.title, notification.body);
});
```

## Mobile Responsiveness
The notification dropdown automatically adjusts on mobile:
- Full width (minus padding) on screens < 768px
- Positioned below navigation bar
- Scrollable content area
- Touch-friendly button sizes

## Security
- All notification endpoints require authentication
- Users can only see their own notifications (enforced by RLS)
- Notifications are created server-side to prevent abuse

## Testing
1. Log in as User A
2. Send a message to User B (via contact seller form)
3. Log in as User B
4. Should see notification bell with badge count
5. Click bell to see notification
6. Click notification to navigate to messages page
7. Notification should be marked as read automatically

## Future Enhancements
- [ ] Supabase Realtime subscriptions for instant updates (no polling)
- [ ] Email notifications via Resend/Nodemailer
- [ ] Push notifications (browser push API)
- [ ] In-app toast notifications (using Sonner or similar)
- [ ] Notification preferences (user settings)
- [ ] Sound notifications (optional)

## Troubleshooting

### Notifications not appearing
1. Check that notifications table exists in database
2. Verify user is authenticated (token in localStorage)
3. Check browser console for errors
4. Verify API endpoints are accessible

### Badge count not updating
1. Ensure `notificationSystem.init()` is called after login
2. Check that polling is running (should see console logs)
3. Verify API is returning correct unread count

### Dropdown not showing
1. Check that notification dropdown HTML is in the page
2. Verify notification toggle button has click handler
3. Check for JavaScript errors in console
