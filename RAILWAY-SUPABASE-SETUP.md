# Railway + Supabase Setup - Quick Guide

## ✅ Migration Complete!

Your code has been migrated from SQLite to Supabase PostgreSQL and pushed to GitHub.

---

## 🔧 Setup Steps for Railway

### Step 1: Add DATABASE_URL to Railway

1. Go to **Railway Dashboard**
2. Click your **Backend Service**
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:J_%40sra%401996@db.nyrpzeygxzfsbkslmzar.supabase.co:5432/postgres`
   - **Important:** The `@` symbols in password are encoded as `%40`
6. Click **"Add"**

Railway will automatically redeploy!

---

## 📊 Step 2: Create Tables in Supabase

1. Go to **Supabase Dashboard** → Your Project
2. Click **"SQL Editor"** in sidebar
3. Click **"New Query"**
4. Copy and paste the SQL from `SUPABASE-SETUP-SQL.sql`
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

Tables are now created!

---

## ✅ Step 3: Verify Setup

### Check Railway Logs

After Railway redeploys, check logs:
- Railway → Your Service → Deployments → Latest → Logs

You should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
Server successfully running on port 8080
Database: PostgreSQL (Supabase)
```

### Test API

1. Visit: `https://autoilty-production.up.railway.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. Test Registration:
   ```
   POST https://autoilty-production.up.railway.app/api/auth/register
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. Check Supabase Dashboard:
   - Go to **"Table Editor"**
   - Click on **"users"** table
   - You should see the new user!

---

## 🔐 Connection String Details

Your Supabase connection string:
```
postgresql://postgres:J_%40sra%401996@db.nyrpzeygxzfsbkslmzar.supabase.co:5432/postgres
```

**Breakdown:**
- **User**: `postgres`
- **Password**: `J_@sra@1996` (encoded as `J_%40sra%401996`)
- **Host**: `db.nyrpzeygxzfsbkslmzar.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`

---

## 📋 Railway Environment Variables Checklist

Make sure you have these in Railway:

- [x] `JWT_SECRET` = `1a2b3c4d5e6f7g8h9i0jklmnopqrstuvwxyz1234567890ABC`
- [ ] `DATABASE_URL` = `postgresql://postgres:J_%40sra%401996@db.nyrpzeygxzfsbkslmzar.supabase.co:5432/postgres`
- [ ] `FRONTEND_URL` = (your frontend URL - add after deploying frontend)

---

## ✅ You're Done!

After adding `DATABASE_URL` to Railway:
1. Railway will redeploy automatically
2. Server connects to Supabase PostgreSQL
3. Tables are created automatically
4. Everything works!

**Your marketplace now uses production-grade PostgreSQL!** 🚀

