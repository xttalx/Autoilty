import { NextRequest, NextResponse } from 'next/server';
import { CountryCode } from '@/lib/countries';
import { SearchFilters } from '@/types';
import { validateCountryCode, validatePagination, handleApiError, ApiError } from '@/lib/api/errors';
import { formatCurrency } from '@/lib/utils/currency';
// import { supabaseAdmin } from '@/lib/supabase/client';

// Mock data - Replace with Supabase queries
const mockListings = [
  {
    id: 'listing_1',
    title: '2023 Toyota Vios',
    make: 'Toyota',
    model: 'Vios',
    year: 2023,
    price: 85000,
    currency: 'SGD',
    mileage: 15000,
    fuelType: 'petrol',
    transmission: 'automatic',
    engine: '1.5L',
    images: ['https://via.placeholder.com/800x600?text=Toyota+Vios'],
    location: 'Singapore',
    country: 'SG' as CountryCode,
    rating: 4.5,
    reviewCount: 23,
    description: 'Well-maintained Toyota Vios, perfect for city driving.',
    features: ['GPS', 'Reverse Camera', 'Bluetooth'],
    sellerName: 'John Doe',
    sellerType: 'private' as const,
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: 'listing_2',
    title: '2022 Honda City',
    make: 'Honda',
    model: 'City',
    year: 2022,
    price: 92000,
    currency: 'SGD',
    mileage: 25000,
    fuelType: 'hybrid',
    transmission: 'cvt',
    engine: '1.5L Hybrid',
    images: ['https://via.placeholder.com/800x600?text=Honda+City'],
    location: 'Singapore',
    country: 'SG' as CountryCode,
    rating: 4.8,
    reviewCount: 45,
    description: 'Honda City Hybrid with excellent fuel economy.',
    features: ['Honda Sensing', 'LED Headlights', 'Keyless Entry'],
    sellerName: 'ABC Motors',
    sellerType: 'dealer' as const,
    createdAt: '2024-11-05T14:00:00Z',
    updatedAt: '2024-11-05T14:00:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const { country } = params;

    // Validate country
    if (!validateCountryCode(country)) {
      throw new ApiError(`Invalid country code: ${country}`, 400, 'INVALID_COUNTRY');
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters: SearchFilters = {
      country: country as CountryCode,
      make: searchParams.get('make') || undefined,
      model: searchParams.get('model') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!, 10) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!, 10) : undefined,
      minYear: searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!, 10) : undefined,
      maxYear: searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!, 10) : undefined,
      fuelType: searchParams.get('fuelType') || undefined,
      transmission: searchParams.get('transmission') || undefined,
      minMileage: searchParams.get('minMileage') ? parseInt(searchParams.get('minMileage')!, 10) : undefined,
      maxMileage: searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage')!, 10) : undefined,
      location: searchParams.get('location') || undefined,
      sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'newest',
    };

    const { page, limit } = validatePagination(
      searchParams.get('page') || undefined,
      searchParams.get('limit') || undefined
    );

    filters.page = page;
    filters.limit = limit;

    // Supabase query (uncomment when schema is ready):
    /*
    let query = supabaseAdmin
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('country', country)
      .eq('status', 'active');

    // Apply filters
    if (filters.make) query = query.eq('make', filters.make);
    if (filters.model) query = query.ilike('model', `%${filters.model}%`);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.minYear) query = query.gte('year', filters.minYear);
    if (filters.maxYear) query = query.lte('year', filters.maxYear);
    if (filters.fuelType) query = query.eq('fuel_type', filters.fuelType);
    if (filters.transmission) query = query.eq('transmission', filters.transmission);
    if (filters.minMileage) query = query.gte('mileage', filters.minMileage);
    if (filters.maxMileage) query = query.lte('mileage', filters.maxMileage);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);

    // Sorting
    const sortMapping = {
      newest: { column: 'created_at', ascending: false },
      price_asc: { column: 'price', ascending: true },
      price_desc: { column: 'price', ascending: false },
      year_desc: { column: 'year', ascending: false },
      mileage_asc: { column: 'mileage', ascending: true },
    };
    
    const sort = sortMapping[filters.sortBy || 'newest'];
    query = query.order(sort.column, { ascending: sort.ascending });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      listings: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
    */

    // Mock implementation
    let filteredListings = [...mockListings];

    // Apply filters (mock)
    if (filters.make) {
      filteredListings = filteredListings.filter((l) => l.make === filters.make);
    }
    if (filters.model) {
      filteredListings = filteredListings.filter((l) =>
        l.model.toLowerCase().includes(filters.model!.toLowerCase())
      );
    }
    if (filters.minPrice) {
      filteredListings = filteredListings.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter((l) => l.price <= filters.maxPrice!);
    }
    if (filters.minYear) {
      filteredListings = filteredListings.filter((l) => l.year >= filters.minYear!);
    }
    if (filters.maxYear) {
      filteredListings = filteredListings.filter((l) => l.year <= filters.maxYear!);
    }
    if (filters.fuelType) {
      filteredListings = filteredListings.filter((l) => l.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      filteredListings = filteredListings.filter((l) => l.transmission === filters.transmission);
    }

    // Sorting (mock)
    switch (filters.sortBy) {
      case 'price_asc':
        filteredListings.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredListings.sort((a, b) => b.price - a.price);
        break;
      case 'year_desc':
        filteredListings.sort((a, b) => b.year - a.year);
        break;
      case 'mileage_asc':
        filteredListings.sort((a, b) => (a.mileage || 0) - (b.mileage || 0));
        break;
      default:
        filteredListings.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    // Pagination
    const total = filteredListings.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        listings: paginatedListings,
        total,
        page,
        limit,
        totalPages,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    const { status, message } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

