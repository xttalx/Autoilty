-- Fix messages table: Make from_user_id nullable for anonymous messages
-- Run this SQL in your Supabase SQL editor if you're getting the error:
-- "null value in column 'from_user_id' violates not-null constraint"

-- Step 1: Drop the NOT NULL constraint on from_user_id (if it exists)
ALTER TABLE messages 
ALTER COLUMN from_user_id DROP NOT NULL;

-- Step 2: Verify the change
-- The column should now accept NULL values for anonymous messages

