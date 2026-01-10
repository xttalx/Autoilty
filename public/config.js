/**
 * AUTOILTY MARKETPLACE - CONFIGURATION
 * 
 * This file can be customized for different environments
 * Update API_URL based on your deployment setup
 */

// API Base URL Configuration
// 
// LOCAL DEVELOPMENT: Uses localhost automatically
// PRODUCTION: Set your Railway backend URL below
//
// To deploy:
// 1. Deploy backend to Railway and get the URL (e.g., https://autoilty-backend.up.railway.app)
// 2. Replace 'YOUR_RAILWAY_BACKEND_URL' below with your actual Railway backend URL
// 3. Remove the '.railway.app' part and just use the subdomain if needed

window.API_URL = window.API_URL || (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
  
  // Local development - automatically uses localhost
  if (isLocal) {
    return 'http://localhost:5000/api';
  }
  
  // Production: Railway backend URL (always HTTPS in production)
  // This is the production backend URL - update if your Railway URL changes
  const productionBackendUrl = 'https://autoilty-production.up.railway.app/api';
  
  // Ensure HTTPS in production
  if (protocol === 'https:' || hostname.includes('.railway.app') || hostname.includes('.vercel.app') || hostname.includes('.netlify.app')) {
    return productionBackendUrl;
  }
  
  // Default to production backend
  return productionBackendUrl;
})();

// Google Maps API Key Configuration
// 
// To enable Google Maps for "Find Dealers" feature:
// 1. Get your Google Maps API key from: https://console.cloud.google.com/google/maps-apis
// 2. Enable "Maps Embed API" and "Maps JavaScript API" in Google Cloud Console
// 3. Replace 'YOUR_GOOGLE_MAPS_API_KEY' below with your actual API key
// 4. For production, consider using environment variables or a secure backend proxy
//
window.GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY || 'AIzaSyD3Q4MGmDsCIt8-h-jAHLU4aEWGNaZdWNk';

// Alternative: Load Google Maps JavaScript API (for interactive maps with markers)
// Uncomment the line below and replace YOUR_GOOGLE_MAPS_API_KEY with your actual key
// This will enable full interactive maps instead of just embed iframes
// You'll also need to add this script tag to your HTML: <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"></script>

// Log configuration (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 API URL configured:', window.API_URL);
  console.log('🌍 Environment: Development');
  if (window.GOOGLE_MAPS_API_KEY && window.GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    console.log('🗺️  Google Maps API key configured');
  } else {
    console.log('⚠️  Google Maps API key not configured - Find Dealers feature will show placeholder');
  }
} else {
  console.log('✅ Production API configured');
}

