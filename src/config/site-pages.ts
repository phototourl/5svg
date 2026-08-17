import { brand } from "@/brand";
import { expandPathsForAllLocales } from "@/lib/i18n/sitemap";
import { getTagPaths } from "@/config/tag-pages";
import { getCategories, getIconDetailPaths, getSvgsByCategory } from "@/data";
import { getDocsPaths } from "@/utils/docs-paths";
import { SHOP_ENABLED } from "@/lib/shop/flags";

/** Marketing home */
export const marketingPaths = ["/"] as const;

export const trustPaths = ["/about", "/license", "/privacy", "/terms", "/contact"] as const;

export const browsePaths = ["/browse"] as const;

export const tagIndexPaths = ["/tags", ...getTagPaths()] as const;

/** App routes with a +page.svelte (excludes redirects like /directory, /docs) */
const appCore = brand.showDeveloperTools
  ? (["/library", "/favorites", "/extensions"] as const)
  : (["/library", "/favorites"] as const);

export const appStaticPaths = (
  SHOP_ENABLED ? [...appCore, "/shop"] : [...appCore]
) as readonly string[];

export function getDirectoryPaths(): string[] {
  return getCategories()
    .filter((category) => getSvgsByCategory(category).length > 0)
    .map((category) => `/directory/${encodeURI(category.toLowerCase())}`);
}

/** Paths excluded from sitemap (still reachable, e.g. user-local favorites). */
const SITEMAP_EXCLUDED = new Set(["/favorites"]);

/** Core pages (excludes per-icon detail URLs). Listed in all supported locales. */
export function getMainSitemapPaths(): string[] {
  const base = [
    ...marketingPaths,
    ...appStaticPaths.filter((path) => !SITEMAP_EXCLUDED.has(path)),
    ...trustPaths,
    ...browsePaths,
    ...tagIndexPaths,
    ...getDirectoryPaths(),
    ...getDocsPaths(),
  ];
  return expandPathsForAllLocales(base);
}

/** Per-logo detail pages (`/icon/*`). */
export function getIconSitemapPaths(): string[] {
  return getIconDetailPaths();
}

/** Every indexable HTML page on 5svg.com */
export function getPublicPagePaths(): string[] {
  return [...getMainSitemapPaths(), ...getIconSitemapPaths()];
}
