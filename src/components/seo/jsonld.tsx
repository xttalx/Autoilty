import type { Metadata } from "next";
import type { ListingSEOProps } from "@/types/seo";

export function generateListingMetadata({
  listing,
  locale
}: ListingSEOProps & { locale: string }): Metadata {
  return {
    title: `${listing.title} — Autoilty`,
    description: listing.description,
    alternates: { canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/listings/${listing.slug}` },
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: listing.images.slice(0, 3).map((src) => ({
        url: src,
        width: 1200,
        height: 675,
        alt: listing.title
      }))
    }
  };
}

export function ListingJsonLd({ listing }: ListingSEOProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    image: listing.images,
    description: listing.description,
    brand: listing.specs?.make ?? "Autoilty Verified",
    sku: listing.id,
    mpn: listing.vin ?? listing.id,
    aggregateRating: listing.reviews
      ? {
          "@type": "AggregateRating",
          ratingValue: listing.reviews.average.toFixed(1),
          reviewCount: listing.reviews.count
        }
      : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: listing.currency,
      price: listing.price,
      availability: "https://schema.org/InStock",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listing.slug}`,
      seller: {
        "@type": listing.seller.type === "dealer" ? "Organization" : "Person",
        name: listing.seller.name,
        telephone: listing.seller.phone
      },
      itemCondition: "https://schema.org/UsedCondition",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: listing.price,
        priceCurrency: listing.currency,
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: 1,
          unitCode: "C62"
        }
      }
    },
    review: listing.reviews
      ? listing.reviews.items.map((review) => ({
          "@type": "Review",
          author: review.reviewer,
          datePublished: review.created_at,
          reviewBody: review.comment,
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: "5",
            worstRating: "1"
          }
        }))
      : [],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Country",
        value: listing.country.toUpperCase()
      },
      {
        "@type": "PropertyValue",
        name: "City",
        value: listing.city
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}



