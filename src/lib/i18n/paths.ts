import { DEFAULT_LOCALE, LOCALE_PREFIX, type AppLocale } from "./config";

/** Strip `/{locale}` prefix from pathname. */
export function stripLocalePrefix(pathname: string, locales: readonly string[]): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first)) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

/** Prefix internal path for locale (`as-needed`: English has no prefix). */
export function localizePath(path: string, locale: AppLocale): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const normalized = path === "/" ? "/" : path.replace(/\/+$/, "") || "/";
  if (locale === DEFAULT_LOCALE && LOCALE_PREFIX === "as-needed") {
    return normalized;
  }
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

/** Switch locale while keeping the same page path. */
export function switchLocalePath(
  pathname: string,
  to: AppLocale,
  locales: readonly string[],
): string {
  const base = stripLocalePrefix(pathname, locales);
  return localizePath(base, to);
}
