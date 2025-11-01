/**
 * Country Homepage Component (Client Component)
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchFilters from '@/components/SearchFilters';
import DirectoryListing from '@/components/DirectoryListing';
import DealCarousel from '@/components/DealCarousel';
import { LazyListingItem } from '@/components/ui/LazyListings';
import { fetchListings, fetchDeals } from '@/lib/api/listings';
import { Listing, SearchFilters as SearchFiltersType } from '@/types';
import { CountryCode, countries } from '@/lib/countries';
import { WebsiteSchema, OrganizationSchema, ItemListSchema } from '@/components/seo/SchemaMarkup';
import { HreflangTags } from '@/components/seo/HreflangTags';

interface CountryHomePageProps {
  country: CountryCode;
}

export default function CountryHomePage({ country }: CountryHomePageProps) {
  const { t } = useTranslation();
  const countryConfig = countries[country];
  
  const [filters, setFilters] = useState<SearchFiltersType>({
    country,
    page: 1,
    limit: 20,
  });
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [deals, setDeals] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch listings when filters change
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const response = await fetchListings(filters);
        setListings(response.listings);
        setTotal(response.total);
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  // Fetch deals on mount
  useEffect(() => {
    const loadDeals = async () => {
      setLoadingDeals(true);
      try {
        const dealsData = await fetchDeals(country, 8);
        setDeals(dealsData);
      } catch (error) {
        console.error('Error loading deals:', error);
      } finally {
        setLoadingDeals(false);
      }
    };

    loadDeals();
  }, [country]);

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters({ ...newFilters, country, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

  return (
    <>
      {/* SEO Schema Markup */}
      <WebsiteSchema country={country} />
      <OrganizationSchema />
      <ItemListSchema
        items={listings.slice(0, 10).map((listing) => ({
          id: listing.id,
          name: `${listing.year} ${listing.make} ${listing.model}`,
          url: `${baseUrl}/${country.toLowerCase()}/listings/${listing.id}`,
          image: listing.images?.[0],
        }))}
        country={country}
      />
      <HreflangTags path="" supportedCountries={['CA', 'SG', 'MY', 'ID', 'TH']} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Find Your Perfect Car in {countryConfig.name}
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                Browse thousands of verified car listings. Compare prices, features, and connect with sellers.
              </p>
            </div>
          </div>
        </section>

        {/* Search Filters */}
        <section className="py-6 sm:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchFilters
              country={country}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </section>

        {/* Best Deals Carousel */}
        {!loadingDeals && deals.length > 0 && (
          <section className="py-6 sm:py-8 lg:py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DealCarousel 
                deals={deals} 
                country={country} 
                title={`🔥 Best Deals in ${countryConfig.name}`} 
              />
            </div>
          </section>
        )}

        {/* Listings Grid */}
        <section className="py-6 sm:py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {loading ? 'Loading...' : `${total.toLocaleString()} Listings Found`}
                </h2>
                {!loading && (
                  <p className="text-gray-600">
                    Showing {listings.length} of {total} results
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-gray-200" />
                    <div className="p-4 sm:p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <svg
                  className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-lg sm:text-xl font-medium text-gray-900">No listings found</h3>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <>
                {/* Listings Grid with Lazy Loading */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {listings.map((listing, index) => (
                    <LazyListingItem key={listing.id} index={index}>
                      <DirectoryListing listing={listing} country={country} />
                    </LazyListingItem>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 sm:mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 sm:px-4 py-2 border rounded-lg text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-primary text-white border-primary'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

