import i18next, { type InitOptions } from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const options: InitOptions = {
  fallbackLng: "en",
  supportedLngs: Array.from(SUPPORTED_LANGUAGES),
  defaultNS: "common",
  ns: ["common", "homepage", "listings", "forms", "faq"],
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  react: {
    useSuspense: false
  }
};

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(HttpBackend)
    .init(options)
    .catch((error) => {
      console.error("i18n initialization failed", error);
    });
}

export default i18next;

