import { Listing } from '@/types';
import { CountryCode, countries } from '@/lib/countries';

/**
 * Generate Product JSON-LD schema for a listing
 */
export function generateListingSchema(listing: Listing, country: CountryCode) {
  const countryConfig = countries[country];
  const image = listing.images?.[0] || '';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${listing.year} ${listing.make} ${listing.model}`,
    description: listing.description || `${listing.year} ${listing.make} ${listing.model} for sale`,
    image: listing.images || [],
    brand: {
      '@type': 'Brand',
      name: listing.make,
    },
    model: listing.model,
    productionDate: `${listing.year}-01-01`,
    offers: {
      '@type': 'Offer',
      price: listing.price.toString(),
      priceCurrency: countryConfig.currency,
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com'}/listings/${listing.id}`,
      seller: {
        '@type': listing.sellerType === 'dealer' ? 'AutoDealer' : 'Person',
        name: listing.sellerName || 'Private Seller',
      },
    },
    aggregateRating: listing.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: listing.rating.toString(),
          reviewCount: (listing.reviewCount || 0).toString(),
        }
      : undefined,
    additionalProperty: [
      listing.mileage && {
        '@type': 'PropertyValue',
        name: 'mileage',
        value: listing.mileage.toString(),
      },
      listing.fuelType && {
        '@type': 'PropertyValue',
        name: 'fuelType',
        value: listing.fuelType,
      },
      listing.transmission && {
        '@type': 'PropertyValue',
        name: 'transmission',
        value: listing.transmission,
      },
      listing.engine && {
        '@type': 'PropertyValue',
        name: 'engine',
        value: listing.engine,
      },
    ].filter(Boolean),
  };
}

/**
 * Generate JSON-LD script tag component
 */
export function ListingSchemaScript({ listing, country }: { listing: Listing; country: CountryCode }) {
  const schema = generateListingSchema(listing, country);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

