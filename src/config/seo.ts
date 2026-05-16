import { brand } from "@/brand";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

/** Bump when replacing static/favicon.png so CDN/browsers fetch the new file. */
export const faviconVersion = "2";

const faviconPath = `/favicon.png?v=${faviconVersion}`;

/** Default SEO / Open Graph / Twitter (aligned with phototourl `seo-metadata.ts`) */
export const siteSeo = {
  title: "5SVG — Free SVG Files & Vector Graphics",
  description:
    "Browse and download free SVG files, brand logos, and icons for Cricut, Silhouette, Canva, crafts, and design. Search by category — no signup.",
  siteName: brand.displayName,
  url: `${siteUrl}/`,
  ogType: "website",
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "5SVG — free SVG files and vector graphics",
  twitterCard: "summary_large_image",
  favicon: faviconPath,
  appleTouchIcon: faviconPath,
} as const;
