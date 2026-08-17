import { brand } from "@/brand";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

/** Primary homepage & default `<title>`. */
export const siteTitle = "5SVG — Free SVG Files & Logo Library";

/** OG alt, image alt, and doc `<title>` suffix. */
export const siteTitleTagline = "Free SVG Files & Logo Library";

/** Docs fallback: `{page} | 5SVG — Free SVG Files & Logo Library`. */
export const siteDocTitleSuffix = `5SVG — ${siteTitleTagline}`;

/** Default SEO / Open Graph / Twitter (aligned with phototourl `seo-metadata.ts`) */
export const siteSeo = {
  title: siteTitle,
  description:
    "Free SVG logo and icon library for makers. Browse and download Free SVG anytime for Cricut, Silhouette, vinyl, design, and crafts — no account required.",
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
