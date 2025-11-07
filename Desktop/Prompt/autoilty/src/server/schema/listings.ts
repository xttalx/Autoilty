import type { ListingSEOProps } from "@/types/seo";

export function buildListingCollectionSchema({
  locale,
  listings
}: {
  locale: string;
  listings: ListingSEOProps["listing"][];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Autoilty ${locale.toUpperCase()} Listings`,
    description: "Browse verified used cars, parts, and services filtered by hyperlocal intent.",
    inLanguage: locale,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Listings",
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/listings`
        }
      ]
    },
    hasPart: listings.map((listing) => ({
      "@type": "Product",
      name: listing.title,
      image: listing.images,
      description: listing.description,
      sku: listing.id,
      offers: {
        "@type": "Offer",
        priceCurrency: listing.currency,
        price: listing.price,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/listings/${listing.slug}`,
        availability: "https://schema.org/InStock"
      },
      review: listing.reviews?.items ?? []
    }))
  };
}

