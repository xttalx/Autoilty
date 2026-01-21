# Notification System Fixes - Unread Count Update Issue

## Problem
The unread count badge was not updating/decreasing after marking notifications as read. It would only update on:
- New notification arrival (INSERT event)
- Full page refresh

It would NOT update when:
- Marking individual notifications as read
- Clicking "Mark all as read"
- Opening the dropdown

## Root Causes Fixed

1. **No Supabase Realtime subscriptions**: System was using polling instead of real-time subscriptions
2. **Not listening to UPDATE events**: Only INSERT events were handled, so marking as read didn't trigger updates
3. **Unread count not derived from notifications array**: Separate state that wasn't synced with notification updates
4. **No optimistic updates**: UI didn't update immediately when marking as read, waiting for server response
5. **Race conditions**: Multiple state updates weren't properly synchronized

## Solutions Implemented

### 1. Supabase Realtime Subscriptions
- **File**: `js/notifications-system.js`
- **Changes**:
  - Replaced polling with Supabase Realtime subscriptions
  - Subscribes to `INSERT`, `UPDATE`, and `DELETE` events on the `notifications` table
  - Filters by `user_id` to only receive relevant notifications
  - Automatically updates local state when database changes

### 2. Derived Unread Count
- **File**: `js/notifications-system.js`
- **Changes**:
  - `unreadCount` is now **derived** from the `notifications` array
  - Uses `recalculateUnreadCount()` method: `notifications.filter(n => !n.read_at).length`
  - Called automatically after any notification state change
  - Ensures count always matches actual notification state

### 3. Optimistic Updates
- **File**: `js/notifications-system.js`
- **Changes**:
  - When marking as read, local state updates **immediately** (optimistic)
  - Database update happens in background
  - If database update fails, optimistic update is rolled back
  - Realtime subscription confirms the update (no-op if already updated)

### 4. Realtime Event Handling
- **File**: `js/notifications-system.js`
- **Changes**:
  - `handleRealtimeEvent()` handles all event types:
    - **INSERT**: Adds new notification, increments unread count
    - **UPDATE**: Updates existing notification, recalculates unread count
    - **DELETE**: Removes notification, recalculates unread count
  - Always calls `recalculateUnreadCount()` after any change

### 5. Configuration
- **File**: `public/config.js`
- **Changes**:
  - Added `SUPABASE_URL` and `SUPABASE_ANON_KEY` configuration
  - Falls back to polling if Supabase not configured

### 6. Server Fix
- **File**: `api/notifications.js`
- **Changes**:
  - Fixed `markAllNotificationsAsRead()` to return correct count
  - Changed from `RETURNING COUNT(*)` (invalid) to `RETURNING id` and counting rows

## Setup Instructions

### 1. Configure Supabase
Edit `public/config.js` and add your Supabase credentials:

```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key-here';
```

Get these from: https://app.supabase.com/project/YOUR_PROJECT/settings/api

### 2. Enable Realtime in Supabase
1. Go to Supabase Dashboard → Database → Replication
2. Find the `notifications` table
3. Enable Realtime for `INSERT`, `UPDATE`, and `DELETE` events

### 3. Enable Row Level Security (RLS)
The `notifications` table should have RLS policies that allow:
- Users to SELECT their own notifications
- Backend to INSERT notifications
- Users to UPDATE their own notifications (to mark as read)

## How It Works Now

### Marking Notification as Read

1. **User clicks notification** → `markAsRead(notificationId)` called
2. **Optimistic update** (immediate):
   - Local notification marked as read: `notification.read_at = now()`
   - Unread count recalculated: `recalculateUnreadCount()`
   - UI updated immediately
3. **API call** (background):
   - `PUT /api/notifications/:id/read`
   - Database updated: `UPDATE notifications SET read_at = NOW() WHERE id = ...`
4. **Realtime confirmation** (automatic):
   - Supabase Realtime sends UPDATE event
   - `handleRealtimeEvent()` receives event
   - Notification already updated, so no change needed
   - Unread count recalculated (already correct)

### Marking All as Read

1. **User clicks "Mark all as read"** → `markAllAsRead()` called
2. **Optimistic update** (immediate):
   - All unread notifications marked as read locally
   - Unread count set to 0
   - UI updated immediately
3. **API call** (background):
   - `PUT /api/notifications/read-all`
   - Database updated: `UPDATE notifications SET read_at = NOW() WHERE user_id = ...`
4. **Realtime confirmation** (automatic):
   - Supabase Realtime sends multiple UPDATE events (one per notification)
   - Each UPDATE event updates local state
   - Unread count stays at 0 (all already marked as read)

## Benefits

✅ **Instant UI updates**: Count decreases immediately when marking as read  
✅ **Always in sync**: Realtime subscriptions keep local state matching database  
✅ **Works across tabs**: Multiple tabs sync via Realtime  
✅ **Fallback support**: Falls back to polling if Supabase not configured  
✅ **Error handling**: Optimistic updates rolled back on failure  
✅ **Performance**: No unnecessary polling, only real-time events  

## Testing

1. **Test unread count update**:
   - Open notification dropdown
   - Click a notification
   - Badge count should decrease immediately

2. **Test mark all as read**:
   - Open notification dropdown
   - Click "Mark all as read"
   - Badge should disappear immediately

3. **Test multiple tabs**:
   - Open site in two tabs
   - Mark notification as read in one tab
   - Badge count should update in both tabs (via Realtime)

4. **Test new notification**:
   - Send a message to yourself
   - Badge count should increase automatically (via Realtime INSERT)

## Troubleshooting

### Badge not updating?
1. Check browser console for errors
2. Verify Supabase credentials in `public/config.js`
3. Verify Realtime is enabled in Supabase Dashboard
4. Check network tab for Realtime WebSocket connection

### Fallback to polling?
- If Supabase is not configured, system automatically falls back to polling
- Check console for: `⚠️ Supabase Realtime not available, using polling fallback`

### Realtime not connecting?
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set correctly
- Check Supabase Dashboard → Logs for connection errors
- Verify RLS policies allow the user to subscribe to their notifications
