# How to See Changes When Running Locally

If you're not seeing changes in your browser, try these solutions:

## Solution 1: Hard Refresh (Easiest)

**Windows/Linux:**
- Press `Ctrl + Shift + R` or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`

This forces the browser to reload all files from the server.

## Solution 2: Clear Browser Cache

1. Open Developer Tools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or:
1. Go to browser settings
2. Clear browsing data
3. Select "Cached images and files"
4. Clear data

## Solution 3: Disable Cache in Developer Tools

1. Open Developer Tools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep Developer Tools open while testing

## Solution 4: Use Incognito/Private Mode

Open the site in a new incognito/private window to bypass cache.

## Solution 5: Restart Local Server

If using `npm run dev` or `npx serve`:
1. Stop the server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

## Solution 6: Check File Paths

Make sure your server is running from the correct directory:
```bash
cd "C:\Data Transfer\Users\Jasraj\Desktop\Prompt\autoilty"
npm run dev
```

Then open: `http://localhost:3000`

## Quick Test

To verify files are updating:
1. Open `index.html` in a text editor
2. Change the hero title temporarily
3. Save the file
4. Hard refresh (Ctrl+Shift+R)
5. See if the change appears

If it does, the issue is cache. If not, check your server setup.







