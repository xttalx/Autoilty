-- Fix messages table: Make from_name, from_email, from_phone nullable
-- Run this SQL in Supabase SQL Editor

-- Check if columns exist and make them nullable
DO $$
BEGIN
  -- Make from_name nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'from_name'
  ) THEN
    ALTER TABLE messages ALTER COLUMN from_name DROP NOT NULL;
    RAISE NOTICE 'Column from_name is now nullable';
  ELSE
    RAISE NOTICE 'Column from_name does not exist';
  END IF;

  -- Make from_email nullable
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'from_email'
  ) THEN
    ALTER TABLE messages ALTER COLUMN from_email DROP NOT NULL;
    RAISE NOTICE 'Column from_email is now nullable';
  ELSE
    RAISE NOTICE 'Column from_email does not exist';
  END IF;

  -- Make from_phone nullable (it might already be nullable, but ensure it)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'from_phone'
  ) THEN
    ALTER TABLE messages ALTER COLUMN from_phone DROP NOT NULL;
    RAISE NOTICE 'Column from_phone is now nullable';
  ELSE
    RAISE NOTICE 'Column from_phone does not exist';
  END IF;
END $$;

-- Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'messages' 
  AND column_name IN ('from_name', 'from_email', 'from_phone')
ORDER BY column_name;

