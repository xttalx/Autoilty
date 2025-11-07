"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, Globe2 } from "lucide-react";
import { useState } from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function Header({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} className="text-xl font-semibold text-primary-300">
          Autoilty
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href={`/${locale}#features`} className="hover:text-primary-200">
            {t("navigation.features")}
          </Link>
          <Link href={`/${locale}/listings`} className="hover:text-primary-200">
            {t("navigation.listings")}
          </Link>
          <Link href={`/${locale}/dealers`} className="hover:text-primary-200">
            {t("navigation.dealers")}
          </Link>
          <Link href={`/${locale}/pricing`} className="hover:text-primary-200">
            {t("navigation.pricing")}
          </Link>
          <Link href={`/${locale}/guides`} className="hover:text-primary-200">
            {t("navigation.guides")}
          </Link>
          <div className="flex items-center gap-2">
            <Globe2 className="size-4" />
            <LocaleSwitcher locale={locale} pathname={pathname ?? `/${locale}`} />
          </div>
          <Link
            href={`/${locale}/dashboard`}
            className="rounded-full bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            {t("navigation.dashboard")}
          </Link>
        </nav>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="size-6" />
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-slate-950/90 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-4 pt-4 text-sm">
            {["features", "listings", "dealers", "pricing", "guides"].map((item) => (
              <Link key={item} href={`/${locale}/${item === "features" ? "" : item}`} className="hover:text-primary-200">
                {t(`navigation.${item}` as const)}
              </Link>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <Globe2 className="size-4" />
              <select
                className="w-full bg-transparent text-sm"
                value={locale}
                onChange={(event) => {
                  const newLocale = event.target.value;
                  window.location.href = `/${newLocale}`;
                }}
              >
                {SUPPORTED_LANGUAGES.map((lng) => (
                  <option key={lng} value={lng}>
                    {lng.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <Link
              href={`/${locale}/dashboard`}
              className="rounded-full bg-primary-500 px-4 py-2 text-center font-semibold text-white"
            >
              {t("navigation.dashboard")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

