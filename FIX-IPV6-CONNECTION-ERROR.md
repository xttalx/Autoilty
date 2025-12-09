# Fix IPv6 Connection Error (ENETUNREACH)

## 🔍 The Problem

Railway is trying to connect to Supabase using IPv6, but it can't reach it:
```
❌ Database initialization error: Error: connect ENETUNREACH 2600:1f16:1cd0:3337:2106:78af:b2e4:5e9f:5432
```

**Error Code:** `ENETUNREACH` - Network unreachable via IPv6

---

## ✅ The Solution

I've updated the PostgreSQL connection to use a connection object format instead of connection string, which should prefer IPv4.

---

## 🔧 What Was Changed

1. **Connection Format:** Changed from connection string to connection object
2. **Explicit Configuration:** Host, port, database, user, password set explicitly
3. **Connection Options:** Added timeout and pool size settings

---

## 🚀 If This Doesn't Work - Alternative Solutions

### Option 1: Use Supabase Connection Pooling URL

Supabase provides a special pooling URL that works better:

1. Go to **Supabase Dashboard** → Your Project
2. Go to **"Settings"** → **"Database"**
3. Find **"Connection Pooling"** section
4. Copy the **"Transaction"** or **"Session"** mode connection string
5. Use that URL instead

**Format:**
```
postgresql://postgres.xxxxx:J_%40sra%401996@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Note: Port is `6543` (pooler) instead of `5432` (direct)

### Option 2: Check Railway Network Settings

Some Railway regions might have IPv6 issues. Check:
- Railway → Your Service → Settings
- Region/Network settings

### Option 3: Verify Supabase Connection String

1. Go to **Supabase Dashboard** → Your Project
2. **Settings** → **Database**
3. Find **"Connection string"** section
4. Copy the **"URI"** connection string
5. Make sure it's correct
6. Update `DATABASE_URL` in Railway

---

## 🔍 Verify Connection String Format

Your connection string should be:
```
postgresql://postgres:J_%40sra%401996@db.nyrpzeygxzfsbkslmzar.supabase.co:5432/postgres
```

**Important:**
- Password `@` symbols must be encoded as `%40`
- Port should be `5432` (direct) or `6543` (pooling)
- Hostname should be correct

---

## 📋 Troubleshooting Steps

1. **Check Railway Logs:**
   - Look for the new error message
   - See if connection succeeds now

2. **Test Connection:**
   - Railway → Deployments → Latest → Logs
   - Should see: `✅ Connected to PostgreSQL database`

3. **Verify Supabase:**
   - Supabase Dashboard → Database
   - Check connection settings
   - Try using connection pooler URL

---

## ✅ After Fixing

You should see in Railway logs:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
Server successfully running on port 8080
Database: PostgreSQL (Supabase)
```

---

**The code has been updated to use connection object format which should resolve the IPv6 issue!**

