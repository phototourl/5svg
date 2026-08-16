/**
 * Locales aligned with EditStamp (42).
 * Display order matches EditStamp language-select-modal.
 */
export const LOCALES = [
  "en",
  "en-GB",
  "en-AU",
  "en-CA",
  "fr-CA",
  "rm",
  "de-CH",
  "fr-CH",
  "de",
  "fr",
  "ar",
  "he",
  "ko",
  "jp",
  "es",
  "it",
  "nl",
  "sv",
  "da",
  "no",
  "fi",
  "pt",
  "pl",
  "cs",
  "tr",
  "ru",
  "uk",
  "zh",
  "zh-TW",
  "hi",
  "id",
  "ms",
  "th",
  "vi",
  "tl",
  "ca",
  "el",
  "bg",
  "hr",
  "hu",
  "ro",
  "sk",
] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

/** Default locale has no URL prefix: `/library` vs `/zh/library`. */
export const LOCALE_PREFIX = "as-needed" as const;

export const LOCALE_COOKIE = "5SVG_LOCALE";

export type LocaleMeta = {
  name: string;
  hrefLang: string;
  /** ISO 3166-1 alpha-2 for flag-icons CDN (EditStamp map). */
  flag: string;
  dir?: "rtl";
};

export const localeMeta: Record<AppLocale, LocaleMeta> = {
  en: { name: "English", hrefLang: "en", flag: "us" },
  "en-GB": { name: "English (UK)", hrefLang: "en-GB", flag: "gb" },
  "en-AU": { name: "English (Australia)", hrefLang: "en-AU", flag: "au" },
  "en-CA": { name: "English (Canada)", hrefLang: "en-CA", flag: "ca" },
  "fr-CA": { name: "Français (Canada)", hrefLang: "fr-CA", flag: "ca" },
  rm: { name: "Rumantsch", hrefLang: "rm", flag: "ch" },
  "de-CH": { name: "Deutsch (Schweiz)", hrefLang: "de-CH", flag: "ch" },
  "fr-CH": { name: "Français (Suisse)", hrefLang: "fr-CH", flag: "ch" },
  de: { name: "Deutsch", hrefLang: "de", flag: "de" },
  fr: { name: "Français", hrefLang: "fr", flag: "fr" },
  ar: { name: "العربية", hrefLang: "ar", flag: "sa", dir: "rtl" },
  he: { name: "עברית", hrefLang: "he", flag: "il", dir: "rtl" },
  ko: { name: "한국어", hrefLang: "ko", flag: "kr" },
  jp: { name: "日本語", hrefLang: "ja", flag: "jp" },
  es: { name: "Español", hrefLang: "es", flag: "es" },
  it: { name: "Italiano", hrefLang: "it", flag: "it" },
  nl: { name: "Nederlands", hrefLang: "nl", flag: "nl" },
  sv: { name: "Svenska", hrefLang: "sv", flag: "se" },
  da: { name: "Dansk", hrefLang: "da", flag: "dk" },
  no: { name: "Norsk", hrefLang: "no", flag: "no" },
  fi: { name: "Suomi", hrefLang: "fi", flag: "fi" },
  pt: { name: "Português", hrefLang: "pt-BR", flag: "br" },
  pl: { name: "Polski", hrefLang: "pl", flag: "pl" },
  cs: { name: "Čeština", hrefLang: "cs", flag: "cz" },
  tr: { name: "Türkçe", hrefLang: "tr", flag: "tr" },
  ru: { name: "Русский", hrefLang: "ru", flag: "ru" },
  uk: { name: "Українська", hrefLang: "uk", flag: "ua" },
  zh: { name: "中文", hrefLang: "zh-CN", flag: "cn" },
  "zh-TW": { name: "繁體中文", hrefLang: "zh-TW", flag: "tw" },
  hi: { name: "हिन्दी", hrefLang: "hi", flag: "in" },
  id: { name: "Bahasa Indonesia", hrefLang: "id", flag: "id" },
  ms: { name: "Bahasa Melayu", hrefLang: "ms", flag: "my" },
  th: { name: "ไทย", hrefLang: "th", flag: "th" },
  vi: { name: "Tiếng Việt", hrefLang: "vi", flag: "vn" },
  tl: { name: "Filipino", hrefLang: "tl", flag: "ph" },
  ca: { name: "Català", hrefLang: "ca", flag: "ad" },
  el: { name: "Ελληνικά", hrefLang: "el", flag: "gr" },
  bg: { name: "Български", hrefLang: "bg", flag: "bg" },
  hr: { name: "Hrvatski", hrefLang: "hr", flag: "hr" },
  hu: { name: "Magyar", hrefLang: "hu", flag: "hu" },
  ro: { name: "Română", hrefLang: "ro", flag: "ro" },
  sk: { name: "Slovenčina", hrefLang: "sk", flag: "sk" },
};

/** Message-file parent when a regional pack is missing (fallback only). */
export const localeMessageParent: Partial<Record<AppLocale, AppLocale>> = {
  "en-GB": "en",
  "en-AU": "en",
  "en-CA": "en",
  "fr-CA": "fr",
  "fr-CH": "fr",
  "de-CH": "de",
  "zh-TW": "zh",
};

export function flagIconUrl(locale: AppLocale): string {
  const country = localeMeta[locale].flag;
  return `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${country}.svg`;
}

export function isLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(param: string | undefined): AppLocale {
  return isLocale(param) ? param : DEFAULT_LOCALE;
}
