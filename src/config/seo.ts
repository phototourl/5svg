import { brand } from "@/brand";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

/** Primary homepage & default `<title>`. */
export const siteTitle = "5SVG — Free SVG Files & Craft SVG Bundles";

/** OG alt, image alt, and doc `<title>` suffix. */
export const siteTitleTagline = "Free SVG Files & Craft SVG Bundles";

/** Docs fallback: `{page} | 5SVG — Free SVG Files & Craft SVG Bundles`. */
export const siteDocTitleSuffix = `5SVG — ${siteTitleTagline}`;

/** Default SEO / Open Graph / Twitter (aligned with phototourl `seo-metadata.ts`) */
export const siteSeo = {
  title: siteTitle,
  description:
    "Free SVG logo library plus paid craft SVG Bundles for makers. Browse Free SVG anytime, or buy original ZIP packs from $4.50 for Cricut, Silhouette, vinyl, and crafts.",
  siteName: brand.displayName,
  url: `${siteUrl}/`,
  ogType: "website",
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `5SVG — ${siteTitleTagline}`,
  twitterCard: "summary_large_image",
  favicon: "/favicon.png",
  appleTouchIcon: "/favicon.png",
} as const;
