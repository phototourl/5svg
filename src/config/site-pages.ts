import fs from "node:fs";
import path from "node:path";

import { brand } from "@/brand";
import { getTagPaths } from "@/config/tag-pages";
import { getCategories, getIconDetailPaths, getSvgsByCategory } from "@/data";
import { getDocsPaths } from "@/utils/docs-paths";
import { iconPacks } from "@/config/icon-packs";

const PACK_ICON_SITEMAP_LIMIT = 50;

/** Pack icon detail URLs from on-disk `index.json` (skipped when packs are absent). */
export function getPackIconSitemapPathsFromDisk(): string[] {
  const paths: string[] = [];

  for (const pack of iconPacks) {
    const indexFile = path.join(process.cwd(), "static", pack.staticDir, "index.json");
    if (!fs.existsSync(indexFile)) continue;

    const index = JSON.parse(fs.readFileSync(indexFile, "utf8")) as {
      items: { id: string }[];
    };

    for (const item of index.items.slice(0, PACK_ICON_SITEMAP_LIMIT)) {
      paths.push(`/more/${pack.id}/icon/${encodeURIComponent(item.id)}`);
    }
  }

  return paths;
}

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
  return getPackIconSitemapPathsFromDisk();
}

export function getPublicPagePaths(): string[] {
  return [
    ...getMainSitemapPaths(),
    ...getIconSitemapPaths(),
    ...getPackIconSitemapPaths(),
  ];
}
