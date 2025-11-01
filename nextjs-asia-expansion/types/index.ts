import { CountryCode } from '@/lib/countries';

export interface Listing {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  images: string[];
  location: string;
  country: CountryCode;
  rating?: number;
  reviewCount?: number;
  description?: string;
  features?: string[];
  sellerName?: string;
  sellerType?: 'dealer' | 'private';
  createdAt: string;
  updatedAt: string;
  forumThreadId?: string;
}

export interface SearchFilters {
  country?: CountryCode;
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  minMileage?: number;
  maxMileage?: number;
  location?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'newest';
  page?: number;
  limit?: number;
}

export interface ListingResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Deal {
  id: string;
  title: string;
  discount: number;
  listingId: string;
  listing: Listing;
  validUntil: string;
  badge?: string; // e.g., "Best Deal", "Featured"
}

