import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ListingJsonLd, generateListingMetadata } from "@/components/seo/jsonld";
import { OSMMap } from "@/components/map/osm-map";
import { getTranslations } from "@/server/get-translations";

interface ListingPageProps {
  params: { locale: string; slug: string };
}

async function fetchListing(locale: string, slug: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("listings")
    .select(
      "id, slug, title, description, price, currency, city, country, images, seller_type, specs, mileage_km, year, appraisal_score, appraisal_meta, lat, lng, vin, profiles:profiles!listings_seller_id_fkey(full_name, dealer_badges)"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .limit(1)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: data.description,
    price: data.price,
    currency: data.currency,
    city: data.city,
    country: data.country,
    images: data.images,
    specs: data.specs,
    mileage_km: data.mileage_km,
    year: data.year,
    appraisal_score: data.appraisal_score,
    appraisal_meta: (data.appraisal_meta as Record<string, unknown> | null) ?? null,
    lat: data.lat,
    lng: data.lng,
    vin: data.vin,
    seller: {
      type: data.seller_type,
      name: data.profiles?.full_name ?? "Autoilty Seller",
      badges: data.profiles?.dealer_badges ?? []
    }
  };
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = await fetchListing(params.locale, params.slug);
  if (!listing) {
    return {};
  }

  return generateListingMetadata({
    listing: {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      description: listing.description,
      images: listing.images,
      currency: listing.currency,
      price: listing.price,
      country: listing.country,
      city: listing.city,
      vin: listing.vin,
      seller: {
        type: listing.seller.type,
        name: listing.seller.name
      }
    },
    locale: params.locale
  });
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { t } = await getTranslations(params.locale, "listings");
  const listing = await fetchListing(params.locale, params.slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <div>
          <div className="grid gap-4 md:grid-cols-2">
            {listing.images.map((image: string) => (
              <img
                key={image}
                src={image}
                alt={`${listing.title} image`}
                className="h-64 w-full rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
          <article className="mt-8 space-y-6">
            <header>
              <h1 className="text-3xl font-semibold text-white">{listing.title}</h1>
              <p className="mt-2 text-sm text-slate-400">
                {listing.city}, {listing.country.toUpperCase()}
              </p>
              <p className="mt-4 text-3xl font-bold text-primary-200">
                {new Intl.NumberFormat(params.locale, {
                  style: "currency",
                  currency: listing.currency
                }).format(listing.price)}
              </p>
            </header>
            <section>
              <h2 className="text-lg font-semibold text-slate-200">{t("details", "Vehicle details")}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{listing.description}</p>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-300 md:grid-cols-2">
                {listing.year ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-xs uppercase text-slate-400">{t("year", "Year")}</dt>
                    <dd className="mt-1 text-base font-semibold text-white">{listing.year}</dd>
                  </div>
                ) : null}
                {listing.mileage_km ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-xs uppercase text-slate-400">{t("mileage", "Mileage")}</dt>
                    <dd className="mt-1 text-base font-semibold text-white">
                      {new Intl.NumberFormat(params.locale).format(listing.mileage_km)} km
                    </dd>
                  </div>
                ) : null}
                {listing.vin ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-xs uppercase text-slate-400">VIN</dt>
                    <dd className="mt-1 font-mono text-sm text-white">{listing.vin}</dd>
                  </div>
                ) : null}
                {listing.appraisal_score ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <dt className="text-xs uppercase text-slate-400">{t("trustScore", "Trust score")}</dt>
                    <dd className="mt-1 text-base font-semibold text-white">{listing.appraisal_score}/100</dd>
                  </div>
                ) : null}
              </dl>
            </section>
            {listing.lat && listing.lng ? (
              <section>
                <h2 className="text-lg font-semibold text-slate-200">{t("location", "Listing location")}</h2>
                <p className="mt-1 text-xs text-slate-400">{t("locationDisclaimer", "Exact coordinates masked until escrow authorization.")}</p>
                <div className="mt-4 overflow-hidden rounded-2xl">
                  <OSMMap lat={listing.lat} lng={listing.lng} />
                </div>
              </section>
            ) : null}
          </article>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">{t("seller", "Seller")}</h2>
            <p className="mt-2 text-sm text-slate-300">{listing.seller.name}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {listing.seller.badges.map((badge: string) => (
                <li
                  key={badge}
                  className="rounded-full bg-primary-500/10 px-3 py-1 text-xs font-medium text-primary-100"
                >
                  {badge}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full rounded-full bg-primary-500 px-5 py-3 text-sm font-semibold text-white">
              {t("ctaEscrow", "Reserve with escrow")}
            </button>
            <button className="mt-3 w-full rounded-full border border-primary-500 px-5 py-3 text-sm font-semibold text-primary-200">
              {t("ctaChat", "Chat with dealer")}
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-200">
              {t("aiPricing", "AI pricing insight")}
            </h3>
            <p className="mt-3 text-sm text-slate-300">
              {(listing.appraisal_meta as { summary?: string } | null)?.summary ??
                t(
                  "aiPricingSummary",
                  "Price aligned with regional comparables and current financing incentives."
                )}
            </p>
          </div>
        </aside>
      </div>
      <ListingJsonLd
        listing={{
          id: listing.id,
          slug: listing.slug,
          title: listing.title,
          description: listing.description,
          images: listing.images,
          currency: listing.currency,
          price: listing.price,
          country: listing.country,
          city: listing.city,
          vin: listing.vin,
          seller: {
            type: listing.seller.type,
            name: listing.seller.name
          }
        }}
      />
    </div>
  );
}

