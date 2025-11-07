import Link from "next/link";

interface ListingCardProps {
  locale: string;
  listing: {
    id: string;
    slug: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    country: string;
    images: string[];
    seller_type: "dealer" | "private";
  };
}

export function ListingCard({ listing, locale }: ListingCardProps) {
  const fallback = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1d82ff" offset="0"/><stop stop-color="#0f172a" offset="1"/></linearGradient></defs>` +
      `<rect width="400" height="300" fill="url(#g)"/>` +
      `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="28" fill="white" opacity="0.6">Autoilty</text>` +
    `</svg>`
  );
  const cover = listing.images?.[0] ?? `data:image/svg+xml,${fallback}`;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur transition hover:border-primary-400 hover:shadow-glow">
      <div className="relative h-56 overflow-hidden">
        <img
          src={cover}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {listing.seller_type === "dealer" ? "Dealer Verified" : "Private"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="line-clamp-2 text-lg font-semibold text-white">{listing.title}</h3>
        <p className="text-sm text-slate-400">
          {listing.city}, {listing.country.toUpperCase()}
        </p>
        <p className="text-xl font-semibold text-primary-200">
          {new Intl.NumberFormat(locale, {
            style: "currency",
            currency: listing.currency
          }).format(listing.price)}
        </p>
        <Link
          href={`/${locale}/listings/${listing.slug}`}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white"
        >
          View listing
        </Link>
      </div>
    </article>
  );
}

