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
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Local development - automatically uses localhost
  if (isLocal) {
    return 'http://localhost:5000/api';
  }
  
  // ⚠️ PRODUCTION: Railway backend URL
  return 'https://autoilty-production.up.railway.app/api';
})();

console.log('API URL configured:', window.API_URL);

