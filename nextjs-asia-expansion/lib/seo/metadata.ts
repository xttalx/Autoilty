/**
 * SEO Metadata Generator
 * Creates dynamic meta tags for Next.js pages
 */

import { Metadata } from 'next';
import { SEOConfig, PageSEOProps, ListingSEOProps } from './types';
import { CountryCode, countries } from '@/lib/countries';
import { generatePageKeywords, generateMetaDescription } from './keywords';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

/**
 * Generate Next.js Metadata for a page
 */
export function generatePageMetadata({
  title,
  description,
  country = 'CA',
  category,
  keywords: customKeywords,
  image,
  noindex = false,
}: PageSEOProps): Metadata {
  const countryConfig = countries[country];
  const countryKeywords = generatePageKeywords(country, category);
  const allKeywords = customKeywords 
    ? [...countryKeywords, ...customKeywords]
    : countryKeywords;

  const fullTitle = title.includes('Autoilty') 
    ? title 
    : `${title} | Autoilty`;

  const canonical = `${BASE_URL}/${country.toLowerCase()}${category ? `/${category}` : ''}`;
  const ogImage = image || `${BASE_URL}/og-image-${country.toLowerCase()}.jpg`;

  return {
    title: {
      default: fullTitle,
      template: '%s | Autoilty',
    },
    description,
    keywords: allKeywords.join(', '),
    authors: [{ name: 'Autoilty' }],
    creator: 'Autoilty',
    publisher: 'Autoilty',
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: countryConfig.locale,
      url: canonical,
      siteName: 'Autoilty',
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@autoilty',
      site: '@autoilty',
    },
    alternates: {
      canonical,
    },
    metadataBase: new URL(BASE_URL),
  };
}

/**
 * Generate metadata for a listing page
 */
export function generateListingMetadata({
  listing,
  baseUrl = BASE_URL,
}: ListingSEOProps): Metadata {
  const { make, model, year, price, currency, location, country, imageUrl, description, id } = listing;
  const countryConfig = countries[country];
  const currencySymbol = countryConfig.currencySymbol;

  const title = `${year} ${make} ${model} for Sale in ${location} | Autoilty ${country}`;
  const metaDescription = description || 
    `Buy ${year} ${make} ${model} in ${location}. Price: ${currencySymbol}${price.toLocaleString()}. View full details, photos, specifications, and contact seller on Autoilty.`;
  
  const keywords = generatePageKeywords(country, undefined, make, model);
  const canonical = `${baseUrl}/${country.toLowerCase()}/listings/${id}`;
  const ogImage = imageUrl || `${baseUrl}/og-listing-${id}.jpg`;

  return {
    title,
    description: metaDescription,
    keywords: keywords.join(', '),
    openGraph: {
      type: 'product',
      locale: countryConfig.locale,
      url: canonical,
      siteName: 'Autoilty',
      title,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${year} ${make} ${model}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
    metadataBase: new URL(baseUrl),
  };
}

/**
 * Generate hreflang alternates for multi-country pages
 */
export function generateHreflangAlternates(
  path: string,
  countries: CountryCode[] = ['CA', 'SG', 'MY', 'ID', 'TH']
) {
  const alternates: Record<string, string> = {};

  countries.forEach((country) => {
    const countryConfig = countries[country];
    const url = `${BASE_URL}/${country.toLowerCase()}${path}`;
    
    // Add primary locale
    alternates[countryConfig.locale] = url;
    
    // Add country-specific locale
    alternates[country.toLowerCase()] = url;
  });

  // Add x-default
  alternates['x-default'] = `${BASE_URL}${path}`;

  return alternates;
}

/**
 * Generate country-specific title
 */
export function generateCountryTitle(
  country: CountryCode,
  baseTitle: string = 'Auto Directory'
): string {
  const countryName = countries[country].name;
  return `${baseTitle} ${countryName} | Autoilty`;
}

