/**
 * AUTOILTY MARKETPLACE - NOTIFICATIONS API
 * 
 * Server-side notification utilities and API routes
 */

const { Pool } = require('pg');

// Helper function to create a notification
async function createNotification(pool, notificationData) {
  const {
    userId,
    type,
    title,
    body = null,
    link = null,
    relatedId = null,
    relatedType = null
  } = notificationData;

  try {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, body, link, related_id, related_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, type, title, body, link, related_id, related_type, read_at, created_at`,
      [userId, type, title, body, link, relatedId, relatedType]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    // Don't throw - notifications are non-critical
    return null;
  }
}

// Helper function to create message notification
async function createMessageNotification(pool, messageData) {
  const {
    toUserId,
    fromUserId,
    fromUsername,
    messageId,
    postingId,
    postingTitle,
    messageText
  } = messageData;

  try {
    // Get posting title for context (if available)
    let title = `New message from ${fromUsername || 'a user'}`;
    let body = messageText.length > 100 
      ? messageText.substring(0, 100) + '...' 
      : messageText;
    
    // Build link to messages page with conversation
    let link = `messages.html?userId=${fromUserId}`;
    if (postingId) {
      link += `&postingId=${postingId}`;
    }

    const notification = await createNotification(pool, {
      userId: toUserId,
      type: 'message',
      title,
      body,
      link,
      relatedId: messageId,
      relatedType: 'message'
    });

    return notification;
  } catch (error) {
    console.error('Error creating message notification:', error);
    return null;
  }
}

// Helper function to get user notifications
async function getUserNotifications(pool, userId, options = {}) {
  const {
    limit = 50,
    offset = 0,
    unreadOnly = false
  } = options;

  try {
    let query = `
      SELECT 
        id,
        user_id,
        type,
        title,
        body,
        link,
        related_id,
        related_type,
        read_at,
        created_at
      FROM notifications
      WHERE user_id = $1
    `;
    
    const params = [userId];
    let paramNum = 1;

    if (unreadOnly) {
      paramNum++;
      query += ` AND read_at IS NULL`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramNum + 1} OFFSET $${paramNum + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
}

// Helper function to get unread notification count
async function getUnreadNotificationCount(pool, userId) {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );
    
    return parseInt(result.rows[0].count || 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Helper function to mark notification as read
async function markNotificationAsRead(pool, notificationId, userId) {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET read_at = NOW()
       WHERE id = $1 AND user_id = $2 AND read_at IS NULL
       RETURNING id`,
      [notificationId, userId]
    );
    
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// Helper function to mark all notifications as read
async function markAllNotificationsAsRead(pool, userId) {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET read_at = NOW()
       WHERE user_id = $1 AND read_at IS NULL
       RETURNING id`,
      [userId]
    );
    
    return result.rows.length;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}

module.exports = {
  createNotification,
  createMessageNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
