import { brand } from "@/brand";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

/** Default SEO / Open Graph / Twitter (aligned with phototourl `seo-metadata.ts`) */
export const siteSeo = {
  title: "5SVG — Free SVG Files & Vector Graphics",
  description:
    "5SVG delivers free, production-ready SVG assets—brand logos and icons organized by category for crafts, vinyl cutting, and design on Cricut, Silhouette, Canva.",
  siteName: brand.displayName,
  url: `${siteUrl}/`,
  ogType: "website",
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "5SVG — free SVG files and vector graphics",
  twitterCard: "summary_large_image",
  favicon: "/favicon.png",
  appleTouchIcon: "/favicon.png",
} as const;
