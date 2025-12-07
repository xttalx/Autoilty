# Fix "Failed to Fetch" Error

## ✅ Your Backend is Running!

Your Railway logs show:
```
🚀 Server running on http://0.0.0.0:8080
📁 Database: /app/database.sqlite
📸 Uploads: /app/uploads
🌍 Environment: production
✅ Production mode: Security features enabled
```

**The backend is working!** The "failed to fetch" error is a frontend connection issue.

---

## 🔍 Common Causes & Solutions

### Issue 1: CORS Not Configured (Most Common)

**Problem:** Frontend can't connect because Railway doesn't know your frontend URL.

**Solution:** Add `FRONTEND_URL` environment variable in Railway.

### Issue 2: Frontend URL Not Set

**Problem:** You haven't deployed frontend yet, or URL is wrong.

**Solution:** Deploy frontend first, then add URL to Railway.

### Issue 3: Wrong API URL in Frontend

**Problem:** Frontend is trying to connect to wrong URL.

**Solution:** Check `public/config.js` has correct Railway URL.

---

## 🛠️ Step-by-Step Fix

### Step 1: Check Your Frontend URL

**If you deployed frontend to Vercel:**
- Your frontend URL is: `https://autoilty.vercel.app` (or similar)
- Copy this URL

**If you deployed frontend to Railway:**
- Your frontend URL is in Railway → Frontend Service → Settings → Domains
- Copy this URL

**If you haven't deployed frontend yet:**
- Deploy frontend first (see below)

### Step 2: Add FRONTEND_URL to Railway Backend

1. Go to **Railway Dashboard**
2. Click your **Backend Service** (API service)
3. Go to **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your frontend URL (e.g., `https://autoilty.vercel.app`)
   - **Important:** Include the full URL with `https://`
6. Click **"Add"**

Railway will automatically redeploy!

### Step 3: Verify Backend URL in Frontend

Check `public/config.js`:
```javascript
return 'https://autoilty-production.up.railway.app/api';
```

Should be your Railway backend URL.

---

## 🔧 Quick Fixes

### Fix 1: Allow All Origins (Temporary Testing)

If you need to test quickly, you can temporarily allow all origins:

1. Railway → Backend Service → Variables
2. Add: `FRONTEND_URL` = `*` (just the asterisk)
3. Railway will redeploy

**⚠️ Warning:** This is less secure. Use specific URL in production.

### Fix 2: Check Browser Console

Open browser DevTools (F12) → Console tab:
- Look for CORS error messages
- Check Network tab for failed requests
- See what error code you get (401, 403, CORS error, etc.)

### Fix 3: Test Backend Directly

Visit in browser:
```
https://autoilty-production.up.railway.app/api/health
```

If this works, backend is fine - issue is CORS/frontend connection.

---

## 📋 Checklist

- [ ] Frontend is deployed (Vercel/Railway)
- [ ] Frontend URL is known
- [ ] `FRONTEND_URL` added to Railway backend variables
- [ ] Railway backend redeployed after adding variable
- [ ] Frontend `config.js` has correct backend URL
- [ ] Testing from production frontend (not localhost)

---

## 🚀 If Frontend Not Deployed Yet

### Deploy Frontend to Vercel (Recommended)

1. Go to **https://vercel.com**
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import repository: **`xttalx/Autoilty`**
5. Click **"Deploy"** (settings auto-detect)
6. Copy your frontend URL (e.g., `https://autoilty.vercel.app`)
7. Add this URL to Railway as `FRONTEND_URL`

---

## 🎯 Most Likely Solution

**The issue is CORS - you need to add `FRONTEND_URL` to Railway:**

1. **Get your frontend URL** (after deploying)
2. **Railway → Backend → Variables**
3. **Add:** `FRONTEND_URL` = `https://your-frontend-url.com`
4. **Wait for redeploy**
5. **Test again**

---

## ✅ After Fixing

Once you add `FRONTEND_URL`:
- Railway will redeploy automatically
- CORS will allow your frontend
- "Failed to fetch" error should disappear
- Frontend can connect to backend

---

## 🔍 Debug Steps

1. **Check browser console** (F12) for exact error
2. **Check Network tab** - see what request is failing
3. **Test backend directly** - `https://autoilty-production.up.railway.app/api/health`
4. **Check Railway logs** - Any CORS errors in backend logs?

---

## 💡 Quick Test

**Test if backend is accessible:**
```
https://autoilty-production.up.railway.app/api/health
```

**If this works but frontend can't connect = CORS issue**
**Solution:** Add `FRONTEND_URL` to Railway

---

**The backend is running fine! Just need to configure CORS with your frontend URL.** 🚀

