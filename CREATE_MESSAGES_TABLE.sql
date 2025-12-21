-- Messages table for Autolity marketplace
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER,
  to_user_id INTEGER NOT NULL,
  posting_id INTEGER NOT NULL,
  from_name TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_phone TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (posting_id) REFERENCES postings(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_posting_id ON messages(posting_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

