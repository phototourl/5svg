/** High-traffic locales (aligned with phototourl priority markets). */
export const LOCALES = [
  "en",
  "zh",
  "es",
  "de",
  "fr",
  "jp",
  "pt",
  "ko",
  "ru",
  "ar",
] as const;

export type AppLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

/** Default locale has no URL prefix: `/library` vs `/zh/library`. */
export const LOCALE_PREFIX = "as-needed" as const;

export const LOCALE_COOKIE = "5SVG_LOCALE";

export const localeMeta: Record<
  AppLocale,
  { name: string; hrefLang: string; dir?: "rtl" }
> = {
  en: { name: "English", hrefLang: "en" },
  zh: { name: "中文", hrefLang: "zh-Hans" },
  es: { name: "Español", hrefLang: "es" },
  de: { name: "Deutsch", hrefLang: "de" },
  fr: { name: "Français", hrefLang: "fr" },
  jp: { name: "日本語", hrefLang: "ja" },
  pt: { name: "Português", hrefLang: "pt" },
  ko: { name: "한국어", hrefLang: "ko" },
  ru: { name: "Русский", hrefLang: "ru" },
  ar: { name: "العربية", hrefLang: "ar", dir: "rtl" },
};

export function isLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function resolveLocale(param: string | undefined): AppLocale {
  return isLocale(param) ? param : DEFAULT_LOCALE;
}
