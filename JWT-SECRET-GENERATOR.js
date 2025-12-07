/**
 * JWT Secret Generator
 * 
 * Generates a secure random JWT secret for production use
 * Run: node JWT-SECRET-GENERATOR.js
 */

const crypto = require('crypto');

// Generate a secure random JWT secret (128 characters = 64 bytes hex)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('='.repeat(60));
console.log('🔐 YOUR JWT SECRET (Copy this for Railway):');
console.log('='.repeat(60));
console.log('');
console.log(jwtSecret);
console.log('');
console.log('='.repeat(60));
console.log('✅ This is a secure, randomly generated secret.');
console.log('✅ Store this securely in Railway environment variables.');
console.log('✅ Never share this secret publicly!');
console.log('='.repeat(60));

