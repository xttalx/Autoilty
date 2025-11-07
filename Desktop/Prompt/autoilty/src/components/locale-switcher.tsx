"use client";

import Link from "next/link";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export function LocaleSwitcher({ locale, pathname }: { locale: string; pathname: string }) {
  const restPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  return (
    <nav className="flex gap-2">
      {SUPPORTED_LANGUAGES.map((lng) => (
        <Link
          key={lng}
          href={`/${lng}${restPath}`}
          className={`text-xs uppercase ${lng === locale ? "text-primary-200" : "text-slate-400 hover:text-primary-100"}`}
          aria-current={lng === locale ? "page" : undefined}
        >
          {lng}
        </Link>
      ))}
    </nav>
  );
}



