import type { iSVG } from "@/types/svg";
import { brand } from "@/brand";
import { getSvgImgUrl } from "@/data";
import { getSvgAltText } from "@/utils/svgAlt";
import { getCategoryHref } from "@/utils/svgLinks";
import { getSvgSlug } from "@/utils/svg-slug";

export const ICON_OG_PNG_SIZE = 512;

/** Prebuilt PNG path when `pnpm build:og-icons` has run. */
export function getIconOgPngPath(svg: iSVG): string | null {
  const slug = getSvgSlug(svg);
  return slug ? `/og/icons/${slug}.png` : null;
}

export function getIconCategories(svg: iSVG): string[] {
  return Array.isArray(svg.category) ? [...svg.category] : [svg.category];
}

/** Share preview prefers build-time PNG; falls back to SVG asset. */
export function getIconSocialPreview(svg: iSVG) {
  const base = brand.siteUrl.replace(/\/+$/, "");
  const pngPath = getIconOgPngPath(svg);

  if (pngPath) {
    return {
      ogImage: `${base}${pngPath}`,
      ogImageAlt: getSvgAltText(svg),
      ogImageWidth: ICON_OG_PNG_SIZE,
      ogImageHeight: ICON_OG_PNG_SIZE,
      twitterCard: "summary_large_image" as const,
    };
  }

  const assetPath = getSvgImgUrl({ url: svg.route, isDark: false });
  return {
    ogImage: `${base}${assetPath}`,
    ogImageAlt: getSvgAltText(svg),
    twitterCard: "summary" as const,
  };
}

export function getIconDetailSeo(svg: iSVG) {
  const categories = getIconCategories(svg);
  const categoryList = categories.join(", ");

  return {
    title: `${svg.title} SVG Logo — Free Download | 5SVG`,
    description: `Download the ${svg.title} logo as a free SVG vector file. Copy SVG code or use in Cricut, Silhouette, Canva, and design tools. Categories: ${categoryList}.`,
    h1: `${svg.title} SVG logo`,
    lead: `Free scalable vector logo for ${svg.title}. Copy markup or download the SVG file for personal projects, mockups, and crafts.`,
    primaryCategory: categories[0],
    primaryCategoryHref: categories[0]
      ? getCategoryHref(categories[0])
      : "/library",
  } as const;
}
