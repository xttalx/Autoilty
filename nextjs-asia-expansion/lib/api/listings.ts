import { Listing, ListingResponse, SearchFilters } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Fetch listings with filters
 */
export async function fetchListings(filters: SearchFilters): Promise<ListingResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  try {
    const response = await fetch(`${API_BASE_URL}/listings?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listings:', error);
    // Return empty response on error
    return {
      listings: [],
      total: 0,
      page: filters.page || 1,
      limit: filters.limit || 20,
      totalPages: 0,
    };
  }
}

/**
 * Fetch featured deals/carousel listings
 */
export async function fetchDeals(country: string, limit: number = 6): Promise<Listing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/deals?country=${country}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch deals: ${response.statusText}`);
    }

    const data = await response.json();
    return data.deals || [];
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

/**
 * Fetch single listing by ID
 */
export async function fetchListingById(id: string): Promise<Listing | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching listing:', error);
    return null;
  }
}

