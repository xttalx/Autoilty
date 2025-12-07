# Railway Health Check Setup - Fix 502 Error

## ✅ Your Server is Running Fine!

Port 8080 is **correct** - Railway automatically assigns this. Your server is listening properly.

The 502 error is a **Railway routing/health check** configuration issue.

---

## 🔧 Fix: Configure Railway Health Check

### Option 1: Via Railway Dashboard (Easiest)

1. Go to **Railway Dashboard**
2. Click your **Backend Service**
3. Go to **"Settings"** tab
4. Scroll down to find:
   - **"Health Check Path"** OR
   - **"Health Check"** section
5. Set the value to: `/` or `/api/health`
6. Click **"Save"**

Railway will automatically redeploy!

### Option 2: Check Railway Service Settings

In Railway Settings, verify:

- **Start Command**: `npm start` (should be default)
- **Build Command**: (leave empty or `npm install`)
- **Port**: Leave empty (Railway auto-detects) OR set to `8080`
- **Health Check Path**: `/` or `/api/health`

---

## 📋 Your Server Has Health Endpoints

Your server.js already has these endpoints:
- ✅ `/` - Root endpoint (returns JSON)
- ✅ `/api/health` - Health check endpoint

Both work! Just tell Railway which one to use.

---

## 🎯 Quick Fix Steps

1. **Railway Dashboard** → Your Backend Service
2. **Settings** tab
3. Find **"Health Check Path"** or **"Health Check"**
4. Set to: `/` (easiest) or `/api/health`
5. **Save**
6. Wait 1-2 minutes for Railway to redeploy
7. Test again: `https://autoilty-production.up.railway.app/api/health`

---

## ⚠️ Important Notes

- ✅ **Don't change port 8080** - Railway sets this automatically
- ✅ **Your server code is correct** - Listening on `0.0.0.0:PORT`
- ✅ **Server is running** - Logs confirm this
- 🔧 **Just need Railway config** - Health check path

---

## 🔍 Why 502 Happens

Railway's proxy needs to know:
1. ✅ Which port? → Auto-detected (8080) 
2. ✅ How to check health? → **Need to configure this!**

Once you set the health check path, Railway knows your server is healthy and routes traffic correctly.

---

## ✅ After Fixing

Once Railway health check is configured:
- ✅ Railway knows server is healthy
- ✅ Traffic routes correctly  
- ✅ 502 error disappears
- ✅ Your API is accessible

---

## 🚀 Test After Fix

Visit:
```
https://autoilty-production.up.railway.app/api/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-..."}
```

---

## 💡 Summary

**Port 8080 is fine - don't change it!**

The issue is Railway needs to know:
- Which endpoint to check for health
- Set Health Check Path to `/` in Railway Settings

**That's it!** Your server code is perfect. Just need Railway configuration. 🚀

