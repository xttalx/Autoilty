# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for product image uploads.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `product-images`
5. Set it to **Public** (so images can be viewed by anyone)
6. Click **Create bucket**

## Step 2: Set Up Storage Policies

Go to **SQL Editor** in Supabase Dashboard and run the following SQL:

```sql
-- Allow authenticated vendors to upload product images
CREATE POLICY "Vendors can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'vendor'
  )
);

-- Allow anyone to view product images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Allow vendors to delete their own product images
CREATE POLICY "Vendors can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'vendor'
  )
);

-- Allow vendors to update their own product images
CREATE POLICY "Vendors can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'vendor'
  )
);
```

## Step 3: Verify Setup

1. Make sure your bucket is set to **Public**
2. Verify the policies are created correctly in **Storage** > **Policies**
3. Test by uploading a product image through the Vendor Dashboard

## Troubleshooting

### Images not uploading
- Check that the bucket name is exactly `product-images`
- Verify your user has the `vendor` role in the `users` table
- Check browser console for error messages

### Images not displaying
- Ensure the bucket is set to **Public**
- Verify the SELECT policy allows public access
- Check that image URLs are being generated correctly

### Permission errors
- Make sure you're logged in as a vendor
- Verify RLS policies are enabled and correct
- Check that your user role is set correctly in the database

## File Structure

Images are stored in the following structure:
```
product-images/
  └── {user_id}/
      └── {timestamp}_{random}.{ext}
```

This ensures:
- Each vendor's images are organized by their user ID
- Unique filenames prevent conflicts
- Easy cleanup if needed

