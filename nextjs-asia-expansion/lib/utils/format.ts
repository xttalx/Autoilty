import { CountryCode, countries } from '@/lib/countries';

/**
 * Format price with currency symbol based on country
 */
export function formatPrice(price: number, countryCode: CountryCode = 'CA'): string {
  const country = countries[countryCode];
  const formatted = new Intl.NumberFormat(country.locale, {
    style: 'currency',
    currency: country.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return formatted;
}

/**
 * Format mileage based on country (km for most, miles for some)
 */
export function formatMileage(mileage: number, countryCode: CountryCode = 'CA'): string {
  // All countries in our list use kilometers
  if (mileage >= 1000) {
    return `${(mileage / 1000).toFixed(1)}k km`;
  }
  return `${mileage} km`;
}

/**
 * Format year
 */
export function formatYear(year: number): string {
  return year.toString();
}

/**
 * Generate star rating display (0-5)
 */
export function getStarRating(rating: number): { full: number; half: number; empty: number } {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const half = hasHalf ? 1 : 0;
  const empty = 5 - full - half;

  return { full, half, empty };
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

