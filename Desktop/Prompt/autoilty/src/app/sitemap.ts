import type { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://autoilty.com";
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("listings")
    .select("slug, updated_at, country")
    .eq("status", "published")
    .limit(5000);

  const listingEntries = (data ?? []).flatMap((listing) => {
    return SUPPORTED_LANGUAGES.map((locale) => ({
      url: `${baseUrl}/${locale}/listings/${listing.slug}`,
      lastModified: listing.updated_at ? new Date(listing.updated_at) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8
    }));
  });

  const baseEntries = SUPPORTED_LANGUAGES.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1
    },
    {
      url: `${baseUrl}/${locale}/listings`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9
    }
  ]);

  return [...baseEntries, ...listingEntries];
}

