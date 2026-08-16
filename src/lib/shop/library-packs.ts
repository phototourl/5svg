import type { iSVG, ThemeOptions } from "@/types/svg";
import type { Category } from "@/types/categories";
import { getCategories, getSvgsByCategory, svgsData } from "@/data";

/** Minimum SVGs if we ever rebuild library category packs. */
export const MIN_CATEGORY_PACK_SIZE = 5;

export function isLibrarySvgFree(_svg: Pick<{ title: string }, "title">): boolean {
  // Entire logo library is free; paid SKUs are craft packs on /shop only.
  return true;
}

export function getFreeLibrarySvgs(): iSVG[] {
  return svgsData;
}

export function getPrimaryCategory(svg: iSVG): Category | undefined {
  const cats = Array.isArray(svg.category) ? svg.category : [svg.category];
  return cats[0];
}

/** Shop pack slug for a library category, e.g. AI → pack-ai */
export function categoryPackSlug(category: Category | string): string {
  return `pack-${String(category).toLowerCase().replace(/\s+/g, "-")}`;
}

export function collectSvgAssetPaths(svg: iSVG): string[] {
  const paths: string[] = [];
  const add = (value?: string | ThemeOptions) => {
    if (!value) return;
    if (typeof value === "string") {
      paths.push(value);
      return;
    }
    paths.push(value.light, value.dark);
  };
  add(svg.route);
  add(svg.wordmark);
  return [...new Set(paths.filter(Boolean))];
}

export function getPackableCategories(): Category[] {
  return getCategories()
    .filter((name) => getSvgsByCategory(name).length >= MIN_CATEGORY_PACK_SIZE)
    .sort((a, b) => getSvgsByCategory(b).length - getSvgsByCategory(a).length);
}

export function priceCentsForCount(count: number): number {
  if (count < 20) return 299;
  if (count < 50) return 499;
  if (count < 100) return 699;
  return 999;
}

export function compareAtCentsForCount(count: number): number {
  return Math.round(priceCentsForCount(count) * 2);
}
