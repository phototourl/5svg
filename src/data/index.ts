import type { iSVG, ThemeOptions } from "@/types/svg";
import type { Category } from "@/types/categories";
import type { Extension } from "@/types/extensions";

import { svgs } from "@/data/svgs";
import { extensions } from "@/data/extensions";

export const svgsData = svgs.map((svg: iSVG, index: number) => {
  return { id: index, ...svg };
}) as iSVG[];

export const extensionsData = extensions.map((extension, index) => {
  return { id: index, ...extension };
}) as Extension[];

export const getCategories = (): Category[] => {
  const categories = svgs
    .flatMap((svg) =>
      Array.isArray(svg.category) ? svg.category : [svg.category],
    )
    .filter((category, index, array) => array.indexOf(category) === index);
  return categories;
};

export const getSvgsByCategory = (category: string): iSVG[] =>
  svgsData.filter((svg: iSVG) => {
    if (Array.isArray(svg.category)) {
      return svg.category.some(
        (categoryItem) => categoryItem.toLowerCase() === category.toLowerCase(),
      );
    } else {
      return svg.category.toLowerCase() === category.toLowerCase();
    }
  });

interface GetSvgImgUrl {
  url: string | ThemeOptions;
  isDark: boolean;
}

export const getSvgImgUrl = ({ url, isDark }: GetSvgImgUrl) => {
  if (typeof url === "string") return url;
  return isDark ? url.dark : url.light;
};

const hasRenderableRoute = (svg: iSVG) => Boolean(svg.route);

/** First logos in catalog order — homepage hero grid (12 slots). */
export const getHeroPreviewSvgs = (count = 12): iSVG[] =>
  svgsData.filter(hasRenderableRoute).slice(0, count);

/** Well-known brands for homepage hero — order reflects recognition. */
const FAMOUS_BRAND_TITLES = [
  "Apple",
  "Google",
  "Microsoft",
  "NVIDIA",
  "Meta",
  "Amazon Web Services",
  "Netflix",
  "Spotify",
  "YouTube",
  "GitHub",
  "OpenAI",
  "Stripe",
  "Facebook",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Twitter",
  "Discord",
  "Adobe",
  "Figma",
  "Notion",
  "Slack",
  "PayPal",
  "Anthropic",
] as const;

/** Resolve library entries by exact title (skips missing). */
export const getSvgsByTitles = (titles: readonly string[]): iSVG[] => {
  const byTitle = new Map(svgsData.map((svg) => [svg.title.trim(), svg]));
  return titles
    .map((title) => byTitle.get(title))
    .filter((svg): svg is iSVG => Boolean(svg?.route));
};

export const getFamousBrandPreviewSvgs = (count = 12): iSVG[] => {
  const byTitle = new Map(svgsData.map((svg) => [svg.title.trim(), svg]));
  const picked: iSVG[] = [];
  const seen = new Set<number>();

  for (const title of FAMOUS_BRAND_TITLES) {
    if (picked.length >= count) break;
    const svg = byTitle.get(title);
    if (!svg?.route || svg.id === undefined || seen.has(svg.id)) continue;
    seen.add(svg.id);
    picked.push(svg);
  }

  return picked;
};

/** Preview grid for a category tab (up to `count` items). */
export const getCategoryPreviewSvgs = (category: Category, count = 12): iSVG[] =>
  getSvgsByCategory(category).filter(hasRenderableRoute).slice(0, count);

/** Evenly sample logos for homepage marquees / previews. */
export const sampleSvgs = (count: number, offset = 0): iSVG[] => {
  const pool = svgsData.filter(hasRenderableRoute);
  if (pool.length === 0) return [];
  if (pool.length <= count) return pool;

  const step = Math.max(1, Math.floor(pool.length / count));
  return Array.from({ length: count }, (_, index) => {
    const i = (index * step + offset) % pool.length;
    return pool[i]!;
  });
};

export type CategoryStat = {
  name: Category;
  count: number;
  href: string;
  preview: iSVG | null;
};

export const getCategoryStats = (limit?: number): CategoryStat[] => {
  const stats = getCategories()
    .map((name) => ({
      name,
      count: getSvgsByCategory(name).length,
      href: `/directory/${name.toLowerCase()}`,
      preview: getCategoryPreviewSvgs(name, 1)[0] ?? null,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return limit ? stats.slice(0, limit) : stats;
};

export const getPopularCategories = (limit = 8): Category[] =>
  getCategoryStats(limit).map((item) => item.name);
