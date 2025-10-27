# Google Maps API Setup for Mechanic Finder

## 🔑 Getting Your Google Maps API Key

The mechanic finder uses Google Places API to search for auto repair shops. You need to set up a Google Maps API key.

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Create a new project (or select existing one)

### Step 2: Enable APIs

Enable these APIs for your project:

1. **Maps JavaScript API** - For displaying the map
2. **Places API** - For searching auto repair shops
3. **Geocoding API** - For converting addresses to coordinates

**How to enable:**
- Go to "APIs & Services" > "Library"
- Search for each API name
- Click "Enable"

### Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key

### Step 4: Restrict Your API Key (Recommended for Production)

1. Click on your API key to edit
2. Under "API restrictions":
   - Select "Restrict key"
   - Choose: Maps JavaScript API, Places API, Geocoding API
3. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add your domain: `https://yourdomain.com/*`
   - Or for testing: `http://localhost/*`

### Step 5: Add Your API Key to the Code

**Option A: Quick Test (Replace in HTML)**

Open `tools/mechanic-finder.html` and replace:

```javascript
// Line 215 - Replace with your API key
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places&callback=initMap" async defer></script>
```

**Option B: Environment Variable (Better for Production)**

Create a configuration file and use it:

1. Create `js/google-maps-config.js`:
```javascript
window.GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';
```

2. Update `mechanic-finder.html`:
```html
<script src="../js/google-maps-config.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=' + window.GOOGLE_MAPS_API_KEY + '&libraries=places&callback=initMap" async defer></script>
```

---

## 💰 Pricing (Free Tier)

Google Maps API has a **free tier**:

- **Monthly free credit:** $200
- **Maps JavaScript API:** Free for Map loads
- **Places API:** 
  - Text Search: Free up to $40/month
  - ~1,000 free searches per day
- **Geocoding API:** Free up to $40/month

**For personal/small sites:** This is usually FREE! ✅

For detailed pricing: https://developers.google.com/maps/billing-and-pricing/pricing

---

## 🧪 Testing

1. Open `tools/mechanic-finder.html` in browser
2. Enter a location (e.g., "Toronto, ON")
3. Click "Search"
4. You should see real mechanics from Google Places!

---

## ❌ Troubleshooting

### "This page can't load Google Maps correctly"
- **Cause:** API key missing or invalid
- **Fix:** Add/update your API key

### "RefererNotAllowedMapError"
- **Cause:** API key restrictions
- **Fix:** Add your domain to allowed referrers

### "Over Query Limit"
- **Cause:** Too many requests
- **Fix:** Wait a bit, or upgrade plan

### No results showing
- **Cause:** API not enabled
- **Fix:** Enable Places API in Cloud Console

---

## 🔐 Security Notes

1. **Don't commit API keys to public repositories**
2. **Use environment variables** for API keys
3. **Restrict API keys** by domain
4. **Monitor usage** in Cloud Console
5. **Set up billing alerts**

---

## 📝 Current Implementation

The mechanic finder now:

✅ Searches Google Places for auto repair shops  
✅ Uses real-time data from Google Maps  
✅ Shows ratings and reviews  
✅ Displays shop information  
✅ Finds nearby mechanics based on user location  
✅ Supports filtering by service type  

---

## 🎯 What Users Can Do

1. **Enter location** - Any city, postal code, or address in Canada
2. **Select service type** - General, Oil Change, Brakes, etc.
3. **View results** - Real mechanics with ratings from Google
4. **Click markers** - See details on map
5. **Visit websites** - Direct links to mechanic websites

---

## 💡 Alternative: Use Without API Key (Mock Data)

If you don't want to set up an API key yet, the page will show helpful instructions. You can also use the static mock data by not initializing the Google Maps API.

---

Need help? Check Google's official docs: https://developers.google.com/maps/documentation

