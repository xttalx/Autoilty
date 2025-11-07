import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEFAULT_PAGE_SIZE, SUPPORTED_COUNTRIES } from "@/lib/constants";
import { ListingCard } from "@/features/listings/listing-card";
import { getTranslations } from "@/server/get-translations";
import { buildListingCollectionSchema } from "@/server/schema/listings";

interface ListingsPageProps {
  params: { locale: string };
  searchParams: {
    country?: string;
    q?: string;
    page?: string;
  };
}

export default async function ListingsPage({ params, searchParams }: ListingsPageProps) {
  const supabase = createSupabaseServerClient();
  const { t } = await getTranslations(params.locale, "listings");

  const page = Number(searchParams.page ?? 1);
  const limit = DEFAULT_PAGE_SIZE;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const countryFilter = searchParams.country;
  if (countryFilter && !SUPPORTED_COUNTRIES.includes(countryFilter as any)) {
    notFound();
  }

  let query = supabase
    .from("listings")
    .select("id, slug, title, description, price, currency, city, country, images, seller_type", { count: "exact" })
    .eq("status", "published");

  if (countryFilter) {
    query = query.eq("country", countryFilter);
  }

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }

  const { data, count } = await query.range(from, to);

  const schema = buildListingCollectionSchema({
    locale: params.locale,
    listings: (data ?? []).map((listing: {
      id: string;
      slug: string;
      title: string;
      description: string;
      images: string[];
      currency: string;
      price: number;
      country: string;
      city: string;
      seller_type: "dealer" | "private";
    }) => ({
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      description: listing.description,
      images: listing.images,
      currency: listing.currency,
      price: listing.price,
      country: listing.country,
      city: listing.city,
      seller: {
        type: listing.seller_type,
        name: "Autoilty Seller"
      }
    }))
  });

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">{t("heading", "Hyperlocal listings")}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {t(
              "subheading",
              "Discover verified vehicles, parts, and services with escrow-ready checkout and AI valuations."
            )}
          </p>
        </div>
        <form className="flex w-full max-w-md items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <input
            name="q"
            defaultValue={searchParams.q ?? ""}
            placeholder={t("searchPlaceholder", "Search by make, model, VIN")}
            className="flex-1 bg-transparent text-sm text-slate-200 outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
          >
            {t("searchAction", "Search")}
          </button>
        </form>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {(data ?? []).map((listing: {
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
      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-300">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const search = new URLSearchParams(searchParams as Record<string, string>);
            search.set("page", pageNumber.toString());
            return (
              <Link
                key={pageNumber}
                href={`/${params.locale}/listings?${search.toString()}`}
                className={`rounded-full px-3 py-1 ${pageNumber === page ? "bg-primary-500 text-white" : "bg-white/5"}`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </nav>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </div>
  );
}

