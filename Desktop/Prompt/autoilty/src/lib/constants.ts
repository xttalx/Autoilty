export const SUPPORTED_COUNTRIES = ["ca", "in", "pk", "cn", "bd"] as const;

export const SUPPORTED_LANGUAGES = ["en", "fr", "hi", "ur", "zh", "bn"] as const;

export const COUNTRY_LOCALE_MAP: Record<(typeof SUPPORTED_COUNTRIES)[number], (typeof SUPPORTED_LANGUAGES)[number][]> = {
  ca: ["en", "fr"],
  in: ["en", "hi"],
  pk: ["en", "ur"],
  cn: ["en", "zh"],
  bd: ["en", "bn"]
};

export const DEFAULT_PAGE_SIZE = 24;

export const TRUST_BADGES = [
  "verified-dealer",
  "escrow-protected",
  "inspection-certified",
  "finance-ready"
] as const;


