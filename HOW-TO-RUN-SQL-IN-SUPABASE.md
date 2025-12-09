# How to Run SQL in Supabase - Step by Step Guide

## 📝 Quick Steps

### Step 1: Access Supabase Dashboard

1. Go to **https://supabase.com**
2. **Sign in** to your account
3. You'll see your projects list

---

### Step 2: Open Your Project

1. Click on your **Autoilty** project (or the project you created)
2. Wait for the dashboard to load

---

### Step 3: Open SQL Editor

1. In the left sidebar, look for **"SQL Editor"**
   - It has a SQL icon (looks like `</>` or database icon)
2. Click on **"SQL Editor"**
3. You'll see a SQL editor interface

---

### Step 4: Create New Query

1. Click the **"New Query"** button (top right)
   - Or click the **"+"** button
2. A new SQL editor tab will open

---

### Step 5: Copy and Paste SQL

1. Open the file: **`SUPABASE-SETUP-SQL.sql`** from your project
2. **Copy all the SQL code** from that file
3. **Paste it** into the Supabase SQL Editor

The SQL should look like:
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create postings table
CREATE TABLE IF NOT EXISTS postings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Cars', 'Parts', 'Services', 'Other')),
  image_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id);
CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category);
```

---

### Step 6: Run the SQL

1. **Click the "Run" button** (green button, usually bottom right)
   - Or press **Ctrl+Enter** (Windows) / **Cmd+Enter** (Mac)
2. Wait a few seconds for execution

---

### Step 7: Verify Success

You should see:
- ✅ **"Success. No rows returned"** (this is normal - tables were created)
- ✅ Or a success message

**If you see an error:**
- Check the error message
- Make sure you copied all the SQL
- Try running it again

---

### Step 8: Verify Tables Were Created

1. In Supabase sidebar, click **"Table Editor"**
2. You should see two tables:
   - ✅ **`users`**
   - ✅ **`postings`**
3. Click on each table to see its structure

---

## 🎯 Visual Guide

### Supabase Dashboard Layout:

```
┌─────────────────────────────────────┐
│  Supabase Dashboard                 │
├─────────────────────────────────────┤
│  [Sidebar]                          │
│  - Table Editor                     │
│  - SQL Editor  ← Click here!        │
│  - Authentication                   │
│  - Storage                          │
│  ...                                │
└─────────────────────────────────────┘
```

### SQL Editor Layout:

```
┌─────────────────────────────────────┐
│  SQL Editor                          │
├─────────────────────────────────────┤
│  [New Query]  [Save]  [Run] ← Click! │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ Paste your SQL here            │  │
│  │                                │  │
│  │ CREATE TABLE IF NOT EXISTS...  │  │
│  │                                │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [Results will appear here]         │
└─────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] Logged into Supabase
- [ ] Opened your project
- [ ] Clicked "SQL Editor" in sidebar
- [ ] Clicked "New Query"
- [ ] Pasted SQL from `SUPABASE-SETUP-SQL.sql`
- [ ] Clicked "Run" button
- [ ] Saw "Success" message
- [ ] Verified tables in "Table Editor"

---

## 🔍 Alternative: Using Table Editor

If you prefer a visual interface:

1. Go to **"Table Editor"** in sidebar
2. Click **"New Table"**
3. Create tables manually (not recommended - use SQL instead)

**But using SQL Editor is easier and faster!**

---

## 💡 Tips

- **Save queries:** You can save frequently used SQL queries in Supabase
- **Multiple queries:** You can run multiple SQL statements at once
- **History:** Supabase keeps a history of your queries
- **Formatting:** SQL Editor has syntax highlighting

---

## 🚨 Common Issues

### Issue: "Table already exists"
- **Solution:** This is fine! The `IF NOT EXISTS` clause prevents errors
- Tables are already created - you're good to go!

### Issue: "Permission denied"
- **Solution:** Make sure you're logged in and have access to the project

### Issue: "Syntax error"
- **Solution:** Check that you copied all the SQL correctly
- Make sure there are no extra characters

---

## ✅ After Running SQL

Once you've run the SQL successfully:

1. ✅ Tables are created
2. ✅ Indexes are created
3. ✅ Your Railway backend can now connect
4. ✅ You can start using the API!

---

## 🎉 You're Done!

After running the SQL:
- Your database is ready
- Railway can connect
- Your marketplace will work!

**That's it!** Your Supabase database is now set up! 🚀

