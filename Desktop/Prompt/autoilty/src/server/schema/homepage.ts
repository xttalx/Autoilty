interface ListingPreview {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  country: string;
  images: string[];
  seller_type: "dealer" | "private";
}

export function buildHomepageSchema({
  locale,
  listings
}: {
  locale: string;
  listings: ListingPreview[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Autoilty — ${locale.toUpperCase()} Hyperlocal Automotive Marketplace`,
    description:
      "Buy, sell, and finance verified vehicles with AI pricing, escrow protection, and localized support across Canada, India, Pakistan, China, and Bangladesh.",
    inLanguage: locale,
    primaryImageOfPage: listings[0]?.images?.[0] ?? `${process.env.NEXT_PUBLIC_BASE_URL}/social-card.png`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`
        }
      ]
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    ],
    hasPart: listings.map((listing) => ({
      "@type": "Product",
      name: listing.title,
      image: listing.images.slice(0, 3),
      offers: {
        "@type": "Offer",
        priceCurrency: listing.currency,
        price: listing.price,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/listings/${listing.slug}`,
        availability: "https://schema.org/InStock"
      },
      areaServed: listing.country.toUpperCase(),
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Seller Type",
          value: listing.seller_type
        }
      ]
    }))
  };
}

