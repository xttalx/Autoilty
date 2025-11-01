/**
 * SEO Metadata Types
 * Inspired by Cars.com and Carsome SEO best practices
 */

import { CountryCode } from '@/lib/countries';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface OpenGraphData {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  url: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  siteName?: string;
  locale?: string;
  localeAlternate?: string[];
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface SEOConfig {
  metadata: SEOMetadata;
  openGraph?: OpenGraphData;
  twitter?: TwitterCardData;
  country?: CountryCode;
  hreflang?: {
    country: CountryCode;
    url: string;
    lang: string;
  }[];
  schema?: Record<string, any>;
}

export interface ListingSEOProps {
  listing: {
    id: string;
    title: string;
    make: string;
    model: string;
    year: number;
    price: number;
    currency: string;
    location: string;
    imageUrl?: string;
    description?: string;
    country: CountryCode;
  };
  baseUrl?: string;
}

export interface PageSEOProps {
  title: string;
  description: string;
  country?: CountryCode;
  category?: string;
  keywords?: string[];
  image?: string;
  noindex?: boolean;
}

