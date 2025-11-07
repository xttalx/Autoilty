import type { ReactNode } from "react";
import { dir } from "i18next";
import { cookies } from "next/headers";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  cookies().set("NEXT_LOCALE", params.locale, {
    httpOnly: false,
    sameSite: "lax",
    secure: true
  });

  return (
    <html lang={params.locale} dir={dir(params.locale)}>
      <body className="bg-slate-950 text-slate-50">
        <Providers locale={params.locale}>
          <div className="min-h-screen flex flex-col">
            <Header locale={params.locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={params.locale} />
          </div>
        </Providers>
      </body>
    </html>
  );
}

