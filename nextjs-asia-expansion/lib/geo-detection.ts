import { CountryCode, getCountryByIP, getCountryConfig } from './countries';

export interface GeoDetectionResult {
  countryCode: CountryCode;
  ip: string | null;
  detected: boolean;
}

/**
 * Server-side function to detect country from request headers
 * Works with Next.js 15 App Router
 */
export function detectCountryFromHeaders(headers: Headers): GeoDetectionResult {
  // Try to get IP from various headers (for production deployments)
  const forwardedFor = headers.get('x-forwarded-for');
  const realIP = headers.get('x-real-ip');
  const cfConnectingIP = headers.get('cf-connecting-ip'); // Cloudflare
  
  // Get IP address (first IP in case of multiple)
  const ip = forwardedFor?.split(',')[0]?.trim() || realIP || cfConnectingIP || null;
  
  // Try to detect country from IP
  if (ip) {
    const detectedCountry = getCountryByIP(ip);
    if (detectedCountry) {
      return {
        countryCode: detectedCountry,
        ip,
        detected: true,
      };
    }
  }
  
  // Fallback: Try Accept-Language header
  const acceptLanguage = headers.get('accept-language');
  if (acceptLanguage) {
    // Check for country-specific language preferences
    if (acceptLanguage.includes('ms')) {
      return { countryCode: 'MY', ip, detected: false };
    }
    if (acceptLanguage.includes('id')) {
      return { countryCode: 'ID', ip, detected: false };
    }
    if (acceptLanguage.includes('th')) {
      return { countryCode: 'TH', ip, detected: false };
    }
    if (acceptLanguage.includes('zh')) {
      return { countryCode: 'SG', ip, detected: false }; // Singapore often uses Chinese
    }
  }
  
  // Default to Canada
  return {
    countryCode: 'CA',
    ip,
    detected: false,
  };
}

/**
 * Get country code from cookies (client-side preference)
 */
export function getCountryFromCookie(cookies: string): CountryCode | null {
  const match = cookies.match(/country=([A-Z]{2})/);
  if (match) {
    const code = match[1] as CountryCode;
    if (['CA', 'SG', 'MY', 'ID', 'TH'].includes(code)) {
      return code;
    }
  }
  return null;
}

