'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/types';
import { formatPrice, formatMileage, formatYear, getStarRating, formatRelativeTime } from '@/lib/utils/format';
import { CountryCode } from '@/lib/countries';

interface DirectoryListingProps {
  listing: Listing;
  country: CountryCode;
  className?: string;
}

export default function DirectoryListing({ listing, country, className = '' }: DirectoryListingProps) {
  const rating = listing.rating || 0;
  const stars = getStarRating(rating);
  const primaryImage = listing.images?.[0] || '/placeholder-car.jpg';
  const hasForumLink = !!listing.forumThreadId;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {/* Image */}
      <Link href={`/listings/${listing.id}`} className="block relative aspect-video bg-gray-200 overflow-hidden">
        <Image
          src={primaryImage}
          alt={`${listing.make} ${listing.model} ${listing.year}`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {listing.sellerType === 'dealer' && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Dealer
          </span>
        )}
        {listing.sellerType === 'private' && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Private
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title & Year */}
        <Link href={`/listings/${listing.id}`}>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
            {listing.year} {listing.make} {listing.model}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            {formatPrice(listing.price, country)}
          </span>
        </div>

        {/* Rating & Reviews */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(stars.full)].map((_, i) => (
                <svg
                  key={`full-${i}`}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              {stars.half > 0 && (
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id="half">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              )}
              {[...Array(stars.empty)].map((_, i) => (
                <svg
                  key={`empty-${i}`}
                  className="w-4 h-4 text-gray-300 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {rating.toFixed(1)}
              {listing.reviewCount && ` (${listing.reviewCount})`}
            </span>
          </div>
        )}

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          {listing.mileage !== undefined && (
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatMileage(listing.mileage, country)}
            </div>
          )}
          {listing.fuelType && (
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {listing.fuelType}
            </div>
          )}
          {listing.transmission && (
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              {listing.transmission}
            </div>
          )}
          {listing.engine && (
            <div className="flex items-center text-gray-600">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {listing.engine}
            </div>
          )}
        </div>

        {/* Location & Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.location}
          </div>
          <span>{formatRelativeTime(listing.createdAt)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/listings/${listing.id}`}
            className="flex-1 px-4 py-2 bg-primary text-white text-center rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm sm:text-base"
          >
            View Details
          </Link>
          {hasForumLink && (
            <Link
              href={`/forum/threads/${listing.forumThreadId}`}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium text-sm sm:text-base text-center"
            >
              Forum
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

