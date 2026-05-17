import { brand } from "@/brand";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

/** Primary homepage & default `<title>`. */
export const siteTitle = "5SVG — Free SVG Logo & Icon Library";

/** OG alt, image alt, and doc `<title>` suffix. */
export const siteTitleTagline = "Free SVG Files, Logos & Icons";

/** Docs fallback: `{page} | 5SVG — Free SVG Files, Logos & Icons`. */
export const siteDocTitleSuffix = `5SVG — ${siteTitleTagline}`;

/** Default SEO / Open Graph / Twitter (aligned with phototourl `seo-metadata.ts`) */
export const siteSeo = {
  title: siteTitle,
  description:
    "5SVG delivers free, production-ready SVG assets—brand logos and icons organized by category for crafts, vinyl cutting, and design on Cricut, Silhouette, Canva.",
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
