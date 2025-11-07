"use client";

import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import i18next from "@/lib/i18n/config";

export function Providers({ children, locale }: { children: React.ReactNode; locale: string }) {
  const [client] = useState(() => new QueryClient());

  if (i18next.language !== locale) {
    i18next.changeLanguage(locale).catch(() => {});
  }

  return (
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

