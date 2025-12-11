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
    return 'http://localhost:5000/api/auth';
  }
  
  // Production: Railway backend URL (always HTTPS in production)
  // This is the production backend URL - update if your Railway URL changes
  const productionBackendUrl = 'https://autoilty-production.up.railway.app/api/auth';
  
  // Ensure HTTPS in production
  if (protocol === 'https:' || hostname.includes('.railway.app') || hostname.includes('.vercel.app') || hostname.includes('.netlify.app')) {
    return productionBackendUrl;
  }
  
  // Default to production backend
  return productionBackendUrl;
})();

// Log configuration (only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 API URL configured:', window.API_URL);
  console.log('🌍 Environment: Development');
} else {
  console.log('✅ Production API configured');
}

