# Vercel Project Settings Configuration

## Required Vercel Project Settings

Go to your Vercel project dashboard → Settings → General and configure:

### Root Directory
Set to: `Desktop/Prompt/autoilty/client`

### Build & Development Settings

**Framework Preset:** Create React App

**Build Command:** `npm run build`
(Leave empty to use default, or set explicitly)

**Output Directory:** `build`
(Leave empty to use default, or set explicitly)

**Install Command:** `npm install`
(Leave empty to use default, or set explicitly)

### Alternative: Use Custom Build Commands

If Root Directory doesn't work, use these settings:

**Root Directory:** Leave empty (use repository root)

**Install Command:** 
```bash
cd Desktop/Prompt/autoilty/client && npm install
```

**Build Command:**
```bash
cd Desktop/Prompt/autoilty/client && npm run build
```

**Output Directory:**
```
Desktop/Prompt/autoilty/client/build
```

## Environment Variables

Add these in Settings → Environment Variables:

```
REACT_APP_SUPABASE_URL=https://riimwxyjsqatyvttdajp.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_actual_anon_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_API_URL=https://your-backend-url.com
```

## After Configuration

1. Save all settings
2. Go to Deployments tab
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger automatic deployment

