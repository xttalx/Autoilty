import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const namespaces = ["common", "homepage", "listings", "dashboard", "forms", "faq"] as const;

export async function getTranslations(locale: string, ns: (typeof namespaces)[number]) {
  const instance = createInstance();
  const lang = SUPPORTED_LANGUAGES.includes(locale as any) ? locale : "en";

  await instance
    .use(
      resourcesToBackend((language, namespace) =>
        import(`../../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: lang,
      fallbackLng: "en",
      ns: namespaces,
      defaultNS: "common",
      interpolation: {
        escapeValue: false
      }
    });

  return {
    t: instance.getFixedT(lang, ns),
    i18n: instance
  };
}


