import { LOCALES } from "./config";
import { localizePath } from "./paths";

/** Expand core paths for all locales (as-needed: `en` has no prefix). */
export function expandPathsForAllLocales(paths: readonly string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const path of paths) {
    for (const locale of LOCALES) {
      const localized = localizePath(path, locale);
      if (!seen.has(localized)) {
        seen.add(localized);
        out.push(localized);
      }
    }
  }

  return out;
}
