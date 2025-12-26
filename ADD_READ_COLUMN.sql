-- Add "read" column to messages table
-- Run this SQL in your Supabase SQL Editor to fix the missing column error

-- Check if column exists, if not add it
DO $$
BEGIN
  -- Check if the "read" column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'read'
  ) THEN
    -- Add the "read" column with default value
    ALTER TABLE messages 
    ADD COLUMN read BOOLEAN DEFAULT FALSE NOT NULL;
    
    -- Set all existing messages to read = false (they're already unread)
    UPDATE messages SET read = FALSE WHERE read IS NULL;
    
    RAISE NOTICE 'Column "read" added to messages table successfully.';
  ELSE
    RAISE NOTICE 'Column "read" already exists in messages table.';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages' AND column_name = 'read';

