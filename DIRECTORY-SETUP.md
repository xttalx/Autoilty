# Business Directory Setup Guide

Complete setup instructions for the Business Directory feature using Google Places API.

## 🎯 Features

- ✅ Search for local auto-related businesses
- ✅ Category filters (Regular Maintenance, Detailing, Custom Builds, Tuning, Wheels and Tires, Auto Parts Yard)
- ✅ Location-based search (city, ZIP code, or geolocation)
- ✅ Distance calculation and display (km/miles toggle)
- ✅ Business ratings and reviews
- ✅ Photo thumbnails
- ✅ Website links
- ✅ Responsive design

## 📋 Prerequisites

- Node.js 18+ installed
- Google Cloud account
- Google Places API enabled

## 🔑 Step 1: Get Google Places API Key

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 1.2 Enable Google Places API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Places API"
3. Click on **Places API**
4. Click **Enable**

### 1.3 Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy your API key
4. (Recommended) Restrict the API key:
   - Click **Edit API Key**
   - Under **API restrictions**, select **Restrict key**
   - Choose **Places API**
   - Under **Application restrictions**, set as needed (e.g., HTTP referrers)

## ⚙️ Step 2: Configure Backend

### 2.1 Set Environment Variable

Create a `.env` file in the project root (or set environment variable):

```bash
GOOGLE_PLACES_API_KEY=your-api-key-here
```

**For Windows PowerShell:**
```powershell
$env:GOOGLE_PLACES_API_KEY="your-api-key-here"
```

**For Linux/Mac:**
```bash
export GOOGLE_PLACES_API_KEY="your-api-key-here"
```

### 2.2 Install Dependencies

Make sure `axios` is installed:

```bash
npm install axios
```

### 2.3 Start Backend Server

```bash
npm start
```

The server will use the API key from the environment variable.

## 🎨 Step 3: Test the Feature

1. Open `http://localhost:3000` in your browser
2. Scroll down to "Find Local Auto Businesses" section
3. Try a search:
   - **Keyword**: "auto detailing"
   - **Location**: "Toronto, ON" (or your city)
   - **Category**: Select "Detailing"
   - Click **Search**

## 📝 API Endpoints

### Search Businesses

```
POST /api/directory/search
Content-Type: application/json

{
  "keyword": "auto detailing",
  "location": "Toronto, ON",
  "category": "Detailing",
  "userLat": 43.6532,  // Optional
  "userLng": -79.3832, // Optional
  "unit": "miles"      // or "km"
}
```

**Response:**
```json
{
  "businesses": [
    {
      "id": "place_id",
      "name": "Business Name",
      "rating": 4.5,
      "user_ratings_total": 123,
      "address": "123 Main St, Toronto, ON",
      "location": { "lat": 43.6532, "lng": -79.3832 },
      "photo_reference": "photo_ref",
      "distance_km": 2.5,
      "distance_miles": 1.6,
      "distance": 1.6,
      "distance_unit": "miles",
      "opening_hours": {...},
      "types": [...]
    }
  ],
  "count": 20,
  "unit": "miles"
}
```

### Get Business Details

```
GET /api/directory/business/:placeId
```

**Response:**
```json
{
  "id": "place_id",
  "name": "Business Name",
  "rating": 4.5,
  "user_ratings_total": 123,
  "address": "123 Main St",
  "website": "https://business-website.com",
  "location": { "lat": 43.6532, "lng": -79.3832 },
  "photo_reference": "photo_ref",
  "opening_hours": {...}
}
```

## 🔧 Configuration

### Category Mappings

Categories are mapped to Google Places types:

- **Regular Maintenance** → `car_repair`, `car_dealer`
- **Detailing** → `car_wash`, `car_repair`
- **Custom Builds** → `car_repair`, `establishment`
- **Tuning** → `car_repair`
- **Wheels and Tires** → `car_repair`, `store`
- **Auto Parts Yard** → `auto_parts_store`, `store`

### Distance Calculation

- Uses Haversine formula for distance calculation
- Requires user coordinates (from input or geolocation)
- Supports kilometers and miles
- Default: miles

### Search Radius

Currently set to 25km (15.5 miles). To change:

Edit `server.js` in the `/api/directory/search` route:

```javascript
radius: '25000', // Change to desired radius in meters
```

## 🔒 Security Best Practices

### 1. Restrict API Key

- Restrict to Places API only
- Set application restrictions (HTTP referrers, IP addresses)
- Use different keys for development and production

### 2. Rate Limiting

Consider adding rate limiting to prevent abuse:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const directoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/directory/search', directoryLimiter, async (req, res) => {
  // ... existing code
});
```

### 3. Input Validation

Already implemented:
- Keyword length limit (100 chars)
- Location length limit (100 chars)
- Sanitization of inputs
- Required field validation

### 4. Caching (Optional)

Consider caching results for common searches:

```javascript
// Example with node-cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

// In search route:
const cacheKey = `${keyword}-${location}-${category}`;
const cached = cache.get(cacheKey);
if (cached) return res.json(cached);
// ... perform search
cache.set(cacheKey, result);
```

## 💰 Pricing

Google Places API pricing (as of 2024):

- **Text Search**: $32 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Photo**: $7 per 1,000 requests

**Free tier**: $200 credit per month (covers ~6,250 text searches)

Monitor usage in Google Cloud Console → APIs & Services → Dashboard

## 🐛 Troubleshooting

### API Key Not Working

1. Check that API key is set in environment variable
2. Verify Places API is enabled in Google Cloud Console
3. Check API key restrictions
4. Verify billing is enabled

### No Results Found

1. Try different keywords
2. Check location format (city name, ZIP code, or coordinates)
3. Try a broader search radius
4. Check if businesses exist in that area

### Geolocation Not Working

1. Ensure HTTPS (required for geolocation)
2. Check browser permissions
3. Try manual location input
4. Check browser console for errors

### Distance Not Showing

1. Ensure user coordinates are provided
2. Check if business has location data
3. Verify distance calculation logic

## 📚 Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places API Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Haversine Formula](https://en.wikipedia.org/wiki/Haversine_formula)

## 🚀 Production Deployment

### Environment Variables

Set in your hosting platform:

```
GOOGLE_PLACES_API_KEY=your-production-api-key
```

### CORS Configuration

Update CORS settings in `server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
  credentials: true
}));
```

### API Key Restrictions

1. Restrict to specific HTTP referrers
2. Use different keys for dev/staging/prod
3. Monitor usage regularly
4. Set up billing alerts

---

**Need Help?** Check the main README or open an issue in the repository.

