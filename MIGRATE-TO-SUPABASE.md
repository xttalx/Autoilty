# Migrate from SQLite to Supabase PostgreSQL

## 📋 Overview

This guide will help you migrate from SQLite to Supabase PostgreSQL for better scalability and production reliability.

---

## 🎯 Benefits of Supabase PostgreSQL

- ✅ Better for high-traffic production apps
- ✅ Multiple concurrent connections
- ✅ Built-in backup and scaling
- ✅ Better performance for complex queries
- ✅ Managed database (no file management needed)

---

## 📝 Step 1: Create Supabase Project

1. Go to **https://supabase.com**
2. Sign up/login (free tier available)
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `autoilty-marketplace`
   - **Database Password**: (choose a strong password - save it!)
   - **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for project to be ready

---

## 🔑 Step 2: Get Database Connection String

1. In Supabase dashboard, go to **"Project Settings"**
2. Click **"Database"** in the sidebar
3. Scroll to **"Connection string"**
4. Copy the **"URI"** connection string
   - Looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
5. **Save this** - you'll need it for Railway!

---

## 📊 Step 3: Create Tables in Supabase

Go to Supabase → **"SQL Editor"** and run this SQL:

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_postings_user_id ON postings(user_id);
CREATE INDEX IF NOT EXISTS idx_postings_category ON postings(category);
```

Click **"Run"** to execute.

---

## 🔧 Step 4: Update Server Code

The server.js file will be updated to:
1. Replace `sqlite3` with `pg` (PostgreSQL client)
2. Update all database queries to PostgreSQL syntax
3. Use connection pool for better performance

---

## ⚙️ Step 5: Update Railway Environment Variables

1. Railway → Your Backend Service → **"Variables"** tab
2. Add new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
     - Format: `postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
3. **Keep existing variables:**
   - `JWT_SECRET`
   - `FRONTEND_URL`

---

## 📦 Step 6: Update Dependencies

Package.json will be updated to include:
- `pg` - PostgreSQL client
- `pg-pool` - Connection pooling

SQLite dependency will be removed.

---

## 🚀 Step 7: Deploy

After code updates:
1. Commit and push changes
2. Railway will automatically redeploy
3. Server will connect to Supabase PostgreSQL

---

## ✅ Verification

After deployment, test:
1. Register a new user
2. Create a posting
3. Check Supabase dashboard → **"Table Editor"** to see data

---

## 🔄 Migrating Existing Data

If you have existing SQLite data:
1. Export data from SQLite
2. Import to Supabase using SQL INSERT statements
3. Or use Supabase dashboard → **"Table Editor"** → **"Import"**

---

## 💡 Next Steps

After migration:
- ✅ Better scalability
- ✅ Production-ready database
- ✅ Automatic backups
- ✅ Better performance

**Ready to migrate?** The code changes will be provided next!

