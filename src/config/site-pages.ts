import { allDocs } from "content-collections";
import { brand } from "@/brand";
import { getTagPaths } from "@/config/tag-pages";
import { getCategories, getIconDetailPaths, getSvgsByCategory } from "@/data";
import { getPackIconDetailPaths } from "@/utils/pack-icon-paths.server";
import { iconPacks } from "@/config/icon-packs";

/** Marketing home */
export const marketingPaths = ["/"] as const;

export const trustPaths = ["/about", "/license", "/privacy"] as const;

export const browsePaths = ["/browse"] as const;

export const tagIndexPaths = ["/tags", ...getTagPaths()] as const;

/** App routes with a +page.svelte (excludes redirects like /directory, /docs, /api) */
export const appStaticPaths = brand.showDeveloperTools
  ? (["/library", "/favorites", "/extensions"] as const)
  : (["/library", "/favorites", "/more"] as const);

export function getDirectoryPaths(): string[] {
  return getCategories()
    .filter((category) => getSvgsByCategory(category).length > 0)
    .map((category) => `/directory/${encodeURI(category.toLowerCase())}`);
}

export function getMorePackPaths(): string[] {
  return iconPacks.map((pack) => `/more/${pack.id}`);
}

export function getDocsPaths(): string[] {
  return allDocs
    .filter(
      (doc) => brand.showDeveloperTools || doc._meta.path !== "shadcn-ui",
    )
    .map((doc) => `/docs/${doc._meta.path}`);
}

/** Paths excluded from sitemap (still reachable, e.g. user-local favorites). */
const SITEMAP_EXCLUDED = new Set(["/favorites"]);

/** Core pages (excludes per-icon detail URLs). */
export function getMainSitemapPaths(): string[] {
  return [
    ...marketingPaths,
    ...appStaticPaths.filter((path) => !SITEMAP_EXCLUDED.has(path)),
    ...trustPaths,
    ...browsePaths,
    ...tagIndexPaths,
    ...getDirectoryPaths(),
    ...getMorePackPaths(),
    ...getDocsPaths(),
  ];
}

/** Per-logo detail pages (`/icon/*`). */
export function getIconSitemapPaths(): string[] {
  return getIconDetailPaths();
}

/** Every indexable HTML page on 5svg.com */
export function getPackIconSitemapPaths(): string[] {
  return getPackIconDetailPaths();
}

export function getPublicPagePaths(): string[] {
  return [
    ...getMainSitemapPaths(),
    ...getIconSitemapPaths(),
    ...getPackIconSitemapPaths(),
  ];
}
