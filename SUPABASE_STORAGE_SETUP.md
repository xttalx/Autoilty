# Supabase Storage Setup for Autolity

## Overview
Images are now stored in Supabase Storage instead of local filesystem, preventing 404 errors on Railway redeploys.

## Prerequisites
- Supabase project already set up (you're using it for the database)
- Access to Supabase Dashboard

## Setup Instructions

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `postings` (must match this exactly, or update `SUPABASE_STORAGE_BUCKET` env var)
   - **Public bucket**: ✅ Check this (allows public access to images)
   - Click **"Create bucket"**

### 2. Configure Storage Policies (if bucket is private)

If you chose a private bucket, you'll need to add policies:

1. Go to **Storage** → **Policies**
2. Click **"New Policy"** for the `postings` bucket
3. Add these policies:

**Policy 1: Allow public read access**
- Policy name: `Public read access`
- Allowed operation: `SELECT`
- Target roles: `public`
- USING expression: `true`

**Policy 2: Allow authenticated uploads**
- Policy name: `Authenticated uploads`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- WITH CHECK expression: `true`

**Policy 3: Allow authenticated updates**
- Policy name: `Authenticated updates`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- USING expression: `true`

**Policy 4: Allow authenticated deletes**
- Policy name: `Authenticated deletes`
- Allowed operation: `DELETE`
- Target roles: `authenticated`
- USING expression: `true`

### 3. Get Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Service Role Key** (use this, not the anon key, for server-side uploads)

### 4. Set Railway Environment Variables

Go to Railway Dashboard → Your Service → Variables tab and add:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=postings
```

**Important**: Use the **Service Role Key**, not the anon key. The service role key has full access needed for server-side uploads.

### 5. Deploy

After setting environment variables:
1. Commit and push changes
2. Railway will redeploy automatically
3. Test image upload on a new posting

## How It Works

1. **Upload**: When a user uploads an image, it's stored in Supabase Storage bucket `postings`
2. **URL Storage**: The full public URL (e.g., `https://xxxxx.supabase.co/storage/v1/object/public/postings/posting-123.jpg`) is saved in `postings.image_url`
3. **Display**: Frontend uses the URL directly (no /uploads/ path needed)
4. **Delete**: When a posting is deleted or image is updated, old image is removed from Supabase Storage

## Migration from Local Storage

Existing postings with `/uploads/...` paths will still work (legacy support in code), but:
- New uploads go to Supabase Storage
- Old images will remain on local filesystem until manually migrated
- Consider migrating old postings by re-uploading images or running a migration script

## Troubleshooting

### Images still returning 404
- Check bucket is public OR policies are set correctly
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in Railway
- Check Railway logs for upload errors

### "Failed to upload image" error
- Verify Service Role Key is used (not anon key)
- Check bucket name matches `SUPABASE_STORAGE_BUCKET`
- Ensure bucket exists in Supabase Dashboard

### Old images not displaying
- Old images in `/uploads/` are no longer served (filesystem is ephemeral)
- Either re-upload images for those postings or migrate manually

## Benefits

✅ Images persist across Railway redeploys
✅ No local filesystem dependency
✅ Automatic CDN via Supabase
✅ Scalable storage
✅ Public URLs work from anywhere

