import { allDocs } from "content-collections";
import { getCategories, getSvgsByCategory } from "@/data";

/** Marketing home */
export const marketingPaths = ["/"] as const;

/** App routes with a +page.svelte (excludes redirects like /directory, /docs, /api) */
export const appStaticPaths = ["/library", "/favorites", "/extensions"] as const;

export function getDirectoryPaths(): string[] {
  return getCategories()
    .filter((category) => getSvgsByCategory(category).length > 0)
    .map((category) => `/directory/${encodeURI(category.toLowerCase())}`);
}

export function getDocsPaths(): string[] {
  return allDocs.map((doc) => `/docs/${doc._meta.path}`);
}

/** Every indexable HTML page on 5svg.com */
export function getPublicPagePaths(): string[] {
  return [
    ...marketingPaths,
    ...appStaticPaths,
    ...getDirectoryPaths(),
    ...getDocsPaths(),
  ];
}
