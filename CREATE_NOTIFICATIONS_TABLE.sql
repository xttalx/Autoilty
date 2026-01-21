-- Notifications table schema for Autoilty marketplace
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'question', 'posting_update', 'system')),
  title TEXT NOT NULL,
  body TEXT,
  link TEXT, -- URL to navigate when clicked (e.g., /messages.html?conversation=123 or /posting-detail.html?id=456#questions)
  related_id INTEGER, -- Related entity ID (message_id, posting_id, question_id, etc.)
  related_type TEXT, -- Related entity type ('message', 'posting', 'question')
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read_at ON notifications(user_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_related ON notifications(related_type, related_id);

-- Function to get unread count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM notifications
    WHERE user_id = p_user_id
    AND read_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid()::INTEGER);

-- Policy: System can create notifications (via service role)
CREATE POLICY "Service role can create notifications"
ON notifications FOR INSERT
TO service_role
WITH CHECK (true);

-- Note: For RLS to work with service role inserts, you may need to temporarily disable
-- RLS on INSERT or use a database function with SECURITY DEFINER
-- This is typically handled via server-side API using service role key
