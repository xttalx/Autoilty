/**
 * JSON-LD Schema Markup Component
 * Adds structured data for better SEO
 */

import { ListingSEOProps, PageSEOProps } from '@/lib/seo/types';
import { CountryCode, countries } from '@/lib/countries';

interface SchemaMarkupProps {
  type: 'Website' | 'Organization' | 'Product' | 'BreadcrumbList' | 'ItemList' | 'WebPage';
  data: Record<string, any>;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Website Schema for homepage
 */
export function WebsiteSchema({ country = 'CA' }: { country?: CountryCode }) {
  const countryConfig = countries[country];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

  return (
    <SchemaMarkup
      type="Website"
      data={{
        name: 'Autoilty',
        alternateName: 'Autoilty - Car Marketplace',
        url: `${baseUrl}/${country.toLowerCase()}`,
        description: `Find your perfect car in ${countryConfig.name}. Search thousands of verified car listings.`,
        inLanguage: countryConfig.locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/${country.toLowerCase()}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/**
 * Organization Schema
 */
export function OrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

  return (
    <SchemaMarkup
      type="Organization"
      data={{
        name: 'Autoilty',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          availableLanguage: ['en', 'ms', 'id', 'th'],
        },
        sameAs: [
          // Add social media links when available
          // 'https://www.facebook.com/autoilty',
          // 'https://twitter.com/autoilty',
        ],
      }}
    />
  );
}

/**
 * Product Schema for listings
 */
export function ProductSchema({ listing }: ListingSEOProps) {
  const { make, model, year, price, currency, location, country, imageUrl, description, id } = listing;
  const countryConfig = countries[country];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

  return (
    <SchemaMarkup
      type="Product"
      data={{
        name: `${year} ${make} ${model}`,
        description: description || `${year} ${make} ${model} for sale in ${location}`,
        image: imageUrl || `${baseUrl}/placeholder-car.jpg`,
        brand: {
          '@type': 'Brand',
          name: make,
        },
        manufacturer: {
          '@type': 'Organization',
          name: make,
        },
        model: model,
        category: 'Vehicle',
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
          url: `${baseUrl}/${country.toLowerCase()}/listings/${id}`,
          seller: {
            '@type': 'Organization',
            name: 'Autoilty',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          reviewCount: '10',
        },
      }}
    />
  );
}

/**
 * Breadcrumb Schema
 */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <SchemaMarkup
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

/**
 * ItemList Schema for listing pages
 */
export function ItemListSchema({
  items,
  country = 'CA',
}: {
  items: Array<{ id: string; name: string; url: string; image?: string }>;
  country?: CountryCode;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://autoilty.com';

  return (
    <SchemaMarkup
      type="ItemList"
      data={{
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: item.name,
            image: item.image || `${baseUrl}/placeholder-car.jpg`,
            url: item.url,
          },
        })),
      }}
    />
  );
}

/**
 * WebPage Schema
 */
export function WebPageSchema({
  title,
  description,
  url,
  country = 'CA',
}: {
  title: string;
  description: string;
  url: string;
  country?: CountryCode;
}) {
  const countryConfig = countries[country];

  return (
    <SchemaMarkup
      type="WebPage"
      data={{
        name: title,
        description,
        url,
        inLanguage: countryConfig.locale,
        isPartOf: {
          '@type': 'WebSite',
          name: 'Autoilty',
        },
      }}
    />
  );
}

