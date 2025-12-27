# Fix Messages Table Constraint Error

## Problem
The `messages` table has `from_name`, `from_email`, and `from_phone` columns with NOT NULL constraints, but when logged-in users send messages, these fields are null, causing a constraint violation error.

## Solution

### Step 1: Run SQL Migration

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Open the file `FIX_MESSAGES_TABLE_NULLABLE.sql`
3. Copy and paste the entire SQL script into the SQL Editor
4. Click **Run** to execute

This will:
- Make `from_name` nullable
- Make `from_email` nullable  
- Make `from_phone` nullable (if it exists)

### Step 2: Verify Changes

After running the SQL, you should see output like:
```
Column from_name is now nullable
Column from_email is now nullable
Column from_phone is now nullable
```

The verification query at the end will show the updated column definitions.

### Step 3: Server Code Update

The `server.js` file has been updated to:
- **Detect which columns exist** in the messages table (old vs new schema)
- **Populate from_name and from_email** from the logged-in user's data (`req.user.username` and `req.user.email`)
- **Handle both old and new schema** gracefully
- **Provide better error messages** for constraint violations

### How It Works

1. **For logged-in users** (authenticated via JWT):
   - `from_user_id` = `req.user.id` (from JWT token)
   - `from_name` = `req.user.username` (fetched from database)
   - `from_email` = `req.user.email` (fetched from database)
   - `from_phone` = `null` (optional)

2. **Dynamic schema detection**:
   - The code checks if `from_name`, `from_email`, `from_phone` columns exist
   - If they exist (old schema), it populates them
   - If they don't exist (new schema), it only inserts the required fields

3. **Error handling**:
   - Returns 400 for NOT NULL violations with clear error message
   - Returns 400 for foreign key violations
   - Returns 500 for other errors (with details in development mode)

## Testing

After applying the fix:

1. **Test logged-in user sending message**:
   - Login to the marketplace
   - Click "Contact Seller" on any posting
   - Send a message
   - Should succeed without constraint errors

2. **Verify database**:
   - Check that messages are being created with `from_name` and `from_email` populated
   - Check that `from_phone` is null (as expected)

## Notes

- The SQL migration is **safe** - it only makes columns nullable, it doesn't delete data
- The server code is **backward compatible** - it works with both old and new schema
- If you want to completely remove `from_name`, `from_email`, `from_phone` columns later, you can do so after ensuring all messages use the new schema

## Files Changed

1. `FIX_MESSAGES_TABLE_NULLABLE.sql` - SQL migration script
2. `server.js` - Updated POST /api/messages route

