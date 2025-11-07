"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function Footer({ locale }: { locale: string }) {
  const { t } = useTranslation("common");

  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h3 className="font-semibold text-primary-200">Autoilty</h3>
          <p className="mt-3 text-sm text-slate-400">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">{t("footer.marketplace")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href={`/${locale}/listings`} className="hover:text-primary-200">
                {t("footer.listings")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/dealers`} className="hover:text-primary-200">
                {t("footer.dealers")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/services`} className="hover:text-primary-200">
                {t("footer.services")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">{t("footer.support")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href={`/${locale}/support`} className="hover:text-primary-200">
                {t("footer.helpCenter")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/faq`} className="hover:text-primary-200">
                {t("footer.faq")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/trust`} className="hover:text-primary-200">
                {t("footer.trust")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-200">{t("footer.legal")}</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <Link href={`/${locale}/privacy`} className="hover:text-primary-200">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className="hover:text-primary-200">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/cookies`} className="hover:text-primary-200">
                {t("footer.cookies")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Autoilty Technologies Inc. All rights reserved.
      </div>
    </footer>
  );
}



