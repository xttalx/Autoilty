# Troubleshooting "Application failed to respond" Error

## 🔍 Common Causes & Solutions

### Issue 1: Server Not Binding to Railway's PORT

**Problem:** Server might not be listening on the correct port.

**Solution:** Your code already handles this correctly:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, ...);
```

Railway sets `PORT` automatically (you saw it's 8080), so this should work.

**Check:** Look at Railway logs - does it show "Server running on http://localhost:8080"?

---

### Issue 2: Missing Environment Variables

**Problem:** Server might be crashing due to missing required variables.

**Check in Railway:**
1. Go to your service → **"Variables"** tab
2. Make sure you have:
   - ✅ `JWT_SECRET` - Required (server will use default if missing, but better to set it)
   - ⏳ `FRONTEND_URL` - Optional for now

**Solution:** Add missing variables if needed.

---

### Issue 3: Database Initialization Error

**Problem:** SQLite database creation might be failing.

**Check Railway Logs:**
- Look for database-related errors
- Check if `/app/database.sqlite` is being created

**Solution:** Database should create automatically. If errors, check file permissions.

---

### Issue 4: Application Crashes on Startup

**Problem:** Code error causing server to crash.

**Check Railway Logs:**
1. Railway → Your Service → **"Deployments"** tab
2. Click on latest deployment
3. View **"Logs"** tab
4. Look for error messages

**Common errors:**
- Missing dependencies
- Syntax errors
- Import errors

---

### Issue 5: Health Check Endpoint Not Working

**Problem:** Railway might be checking wrong endpoint.

**Test manually:**
```
https://autoilty-production.up.railway.app/api/health
```

If this works, the server is fine - might be a Railway routing issue.

---

## 🔧 Step-by-Step Troubleshooting

### Step 1: Check Railway Logs

1. Go to Railway Dashboard
2. Click on your **backend service**
3. Go to **"Deployments"** tab
4. Click on the **latest deployment**
5. Click **"View Logs"** or **"Logs"** tab

**Look for:**
- ✅ "Server running on http://localhost:8080" - Good!
- ❌ Error messages - Bad, note what they say
- ❌ "Cannot find module" - Missing dependency
- ❌ "Port already in use" - Port conflict
- ❌ Database errors - SQLite issue

### Step 2: Check Environment Variables

1. Railway → Your Service → **"Variables"** tab
2. Verify:
   - `JWT_SECRET` exists (or server uses default)
   - No typos in variable names

### Step 3: Test Health Endpoint

Try accessing:
```
https://autoilty-production.up.railway.app/api/health
```

**If it works:**
- Server is running fine
- Issue might be with Railway's routing or health checks

**If it doesn't work:**
- Server might not be responding
- Check logs for errors

### Step 4: Check Service Status

In Railway:
1. Your Service → **"Settings"** tab
2. Check **"Health Check Path"** (if configured)
3. Railway might be checking wrong endpoint

**Default Railway health check:** Usually checks root `/` or `/health`

**Your health endpoint:** `/api/health`

**Solution:** Configure health check path in Railway settings, or add root endpoint.

---

## 🛠️ Quick Fixes

### Fix 1: Add Root Health Check Endpoint

Add this to `server.js` (before the existing health check):

```javascript
// Root health check (for Railway)
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Autoilty Marketplace API' });
});
```

### Fix 2: Verify Server is Listening

Your server should be listening on:
```javascript
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: ${dbPath}`);
  console.log(`📸 Uploads: ${UPLOAD_DIR}`);
});
```

**Important:** Make sure it's listening on `0.0.0.0` (all interfaces), not just `localhost`.

### Fix 3: Check Railway Service Configuration

1. Railway → Your Service → **"Settings"**
2. Verify:
   - **Start Command**: `npm start` (or `node server.js`)
   - **Health Check Path**: Leave empty or set to `/api/health`

---

## 🔍 Debugging Steps

### 1. Check What Railway Sees

Look at Railway logs for:
- Server startup messages
- Any error stack traces
- Port binding confirmation

### 2. Test API Endpoints Directly

Try these URLs:
```
https://autoilty-production.up.railway.app/api/health
https://autoilty-production.up.railway.app/api/postings
```

### 3. Check Network Tab

If accessing from browser:
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try accessing the URL
4. See what error code you get (500, 502, 503, etc.)

---

## 🚨 Common Error Codes

- **502 Bad Gateway** - Server not responding
- **503 Service Unavailable** - Server crashed or not started
- **504 Gateway Timeout** - Server taking too long
- **500 Internal Server Error** - Server error (check logs)

---

## ✅ Quick Checklist

- [ ] Check Railway deployment logs
- [ ] Verify server shows "Server running" message
- [ ] Test `/api/health` endpoint directly
- [ ] Check environment variables are set
- [ ] Verify no errors in logs
- [ ] Check Railway service is "Active"
- [ ] Try redeploying if needed

---

## 🔄 Try Redeploying

If nothing works:

1. Railway → Your Service → **"Deployments"**
2. Click **"Redeploy"** or **"Deploy"** button
3. Watch the logs during deployment
4. Check if it starts successfully

---

## 📞 Need More Help?

**Share these details:**
1. Railway logs (full error messages)
2. What URL you're trying to access
3. Error code (if any)
4. Screenshot of Railway deployment logs

---

**Most likely issue:** Railway health check or routing. Check the logs first! 🔍

