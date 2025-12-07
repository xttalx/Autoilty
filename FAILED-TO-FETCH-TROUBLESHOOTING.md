# "Failed to Fetch" Error - Troubleshooting Guide

## ✅ Your Backend is Running Perfectly!

Your Railway logs confirm:
```
🚀 Server running on http://0.0.0.0:8080
📁 Database: /app/database.sqlite
📸 Uploads: /app/uploads
🌍 Environment: production
✅ Production mode: Security features enabled
```

**Backend is fine!** The issue is connecting the frontend.

---

## 🔍 Most Common Causes

### 1. **CORS Not Configured** (90% of cases)

**Symptom:** Error in browser console: "CORS policy" or "Failed to fetch"

**Solution:** Add `FRONTEND_URL` to Railway backend variables

### 2. **Frontend Not Deployed**

**Symptom:** Testing from localhost but backend is on Railway

**Solution:** Deploy frontend to Vercel/Railway, then configure CORS

### 3. **Wrong API URL**

**Symptom:** Requests going to wrong URL

**Solution:** Check `public/config.js` has correct Railway URL

---

## 🚀 Quick Fix (Step-by-Step)

### Step 1: Check Where You're Testing From

**Are you testing from:**
- A) Localhost (`http://localhost:3000`)? 
- B) Deployed frontend (Vercel/Railway URL)?
- C) Not deployed yet?

### Step 2A: If Testing from Localhost

**Should work automatically!** But check:

1. **Test backend directly:**
   ```
   https://autoilty-production.up.railway.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check browser console (F12):**
   - What's the exact error?
   - Is it a CORS error or network error?

3. **Check Network tab:**
   - What URL is it trying to connect to?
   - What's the response code?

### Step 2B: If Frontend is Deployed

**You MUST add `FRONTEND_URL` to Railway:**

1. **Get your frontend URL:**
   - Vercel: Check your Vercel dashboard
   - Railway: Check your frontend service domain
   - Example: `https://autoilty.vercel.app`

2. **Add to Railway Backend:**
   - Railway Dashboard → Your Backend Service
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - **Key**: `FRONTEND_URL`
   - **Value**: Your full frontend URL (e.g., `https://autoilty.vercel.app`)
   - Click **"Add"**

3. **Wait for Railway to redeploy** (about 1-2 minutes)

4. **Test again** - Should work now!

### Step 2C: If Frontend Not Deployed

**Deploy frontend first:**

#### Option 1: Vercel (Recommended)
1. Go to **https://vercel.com**
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import: **`xttalx/Autoilty`**
5. Click **"Deploy"**
6. Copy your frontend URL
7. Add it to Railway as `FRONTEND_URL`

#### Option 2: Railway
1. Railway → Your Project → **"New Service"**
2. Select GitHub repo: **`xttalx/Autoilty`**
3. Settings → Start Command: `npx serve . -l $PORT`
4. Variables → Add: `PORT` = `3000`
5. Generate domain → Get frontend URL
6. Add it to Railway backend as `FRONTEND_URL`

---

## 🔧 Debugging Steps

### 1. Test Backend Health

Visit:
```
https://autoilty-production.up.railway.app/api/health
```

**If this works:** Backend is fine ✅  
**If this fails:** Check Railway logs for errors

### 2. Check Browser Console

1. Open your frontend
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Look for error messages
5. Go to **Network** tab
6. Try making a request
7. See what fails and why

### 3. Check Network Tab

Look for:
- **Request URL:** Is it correct? (`https://autoilty-production.up.railway.app/api/...`)
- **Status Code:** What error code? (401, 403, 404, CORS error?)
- **Response:** What does it say?

---

## 🎯 Most Likely Solution

**Add `FRONTEND_URL` to Railway backend variables:**

1. Get your frontend URL (after deploying)
2. Railway → Backend Service → Variables
3. Add: `FRONTEND_URL` = `https://your-frontend-url.com`
4. Wait for redeploy
5. Test again

**This fixes 90% of "Failed to fetch" errors!**

---

## 📋 Checklist

- [ ] Backend running ✅ (confirmed from logs)
- [ ] Backend health check works? (test the URL above)
- [ ] Frontend deployed?
- [ ] Frontend URL known?
- [ ] `FRONTEND_URL` added to Railway?
- [ ] Railway redeployed after adding variable?
- [ ] Testing from production frontend?

---

## ⚠️ Common Mistakes

1. **Testing from localhost but backend is on Railway**
   - Deploy frontend first, or test backend directly

2. **Forgot to add `FRONTEND_URL`**
   - CORS blocks requests without this

3. **Wrong frontend URL format**
   - Must be full URL: `https://autoilty.vercel.app`
   - Not just: `autoilty.vercel.app`

4. **Frontend URL not matching actual frontend**
   - Double-check the URL is correct

---

## 💡 Quick Test

**Temporarily allow all origins (for testing only):**

1. Railway → Backend → Variables
2. Add: `FRONTEND_URL` = `*`
3. Wait for redeploy
4. Test again

**If this works:** It's CORS - add your specific frontend URL  
**If this doesn't work:** Different issue - check API URL or backend

---

## ✅ Summary

**Your backend is perfect!** 

The "Failed to fetch" error is because:
- Frontend needs to be deployed, OR
- `FRONTEND_URL` needs to be added to Railway

**Most common fix:** Deploy frontend → Add `FRONTEND_URL` to Railway → Done! ✅

---

**Need more help?** Check the browser console for the exact error message - that will tell us exactly what's wrong!

