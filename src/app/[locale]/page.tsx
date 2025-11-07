import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getTranslations } from "@/server/get-translations";
import { ListingCard } from "@/features/listings/listing-card";
import { CountryFilters } from "@/features/listings/country-filters";
import { buildHomepageSchema } from "@/server/schema/homepage";

export default async function LocaleHome({ params }: { params: { locale: string } }) {
  const supabase = createSupabaseServerClient();
  const { t } = await getTranslations(params.locale, "homepage");

  const { data: featured } = await supabase
    .from("listings")
    .select("id, slug, title, price, currency, city, country, images, seller_type")
    .eq("status", "published")
    .order("appraisal_score", { ascending: false })
    .limit(DEFAULT_PAGE_SIZE);

  const schema = buildHomepageSchema({ locale: params.locale, listings: featured ?? [] });

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-x-0 top-0 h-64 bg-primary-500/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-24 text-center">
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-primary-200">
            {t("hero.badge")}
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-2xl text-base text-slate-300 md:text-lg">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/${params.locale}/listings`}
              className="rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              {t("hero.ctaPrimary")}
            </Link>
            <Link
              href={`/${params.locale}/sell`}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-primary-300 hover:text-primary-200"
            >
              {t("hero.ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>
      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("features.title")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{t("features.subtitle")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {["trust", "pricing", "finance"].map((key) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-primary-100">{t(`features.${key}.title`)}</h3>
              <p className="mt-3 text-sm text-slate-300">{t(`features.${key}.body`)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">{t("featuredListings.title")}</h2>
            <p className="mt-2 text-sm text-slate-400">{t("featuredListings.subtitle")}</p>
          </div>
          <CountryFilters locale={params.locale} />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {(featured ?? []).map((listing: {
            id: string;
            slug: string;
            title: string;
            price: number;
            currency: string;
            city: string;
            country: string;
            images: string[];
            seller_type: "dealer" | "private";
          }) => (
            <ListingCard key={listing.id} locale={params.locale} listing={listing} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`/${params.locale}/listings`}
            className="rounded-full border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-100 hover:bg-primary-500/10"
          >
            {t("featuredListings.cta")}
          </Link>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </>
  );
}

