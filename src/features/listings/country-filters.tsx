"use client";

import Link from "next/link";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";

const LABELS: Record<string, string> = {
  ca: "Canada",
  in: "India",
  pk: "Pakistan",
  cn: "China",
  bd: "Bangladesh"
};

export function CountryFilters({ locale }: { locale: string }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1 text-xs text-slate-300">
      {SUPPORTED_COUNTRIES.map((country) => (
        <Link
          key={country}
          href={`/${locale}/listings?country=${country}`}
          className="rounded-full px-3 py-2 transition hover:bg-primary-500/10"
        >
          {LABELS[country]}
        </Link>
      ))}
    </div>
  );
}

