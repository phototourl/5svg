import { brand } from "@/brand";
import { siteLastUpdated } from "@/config/site-freshness";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

export function getSiteUrl(): string {
  return siteUrl;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** W3C date (YYYY-MM-DD) for sitemap lastmod — update via `site-freshness.ts`. */
export function getSitemapLastmod(): string {
  return siteLastUpdated;
}

/**
 * URL set per sitemaps.org: required `<loc>`, optional `<lastmod>`.
 * Omits `<priority>` and `<changefreq>` (ignored by Google).
 */
export function buildUrlsetXml(paths: string[], lastmod = getSitemapLastmod()): string {
  const urls = paths.map((path) => {
    const loc = `${siteUrl}${path}`;
    return `  <url><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

export function buildSitemapIndexXml(
  sitemapPaths: string[],
  lastmod = getSitemapLastmod(),
): string {
  const entries = sitemapPaths.map((path) => {
    const loc = `${siteUrl}${path}`;
    return `  <sitemap><loc>${escapeXml(loc)}</loc><lastmod>${lastmod}</lastmod></sitemap>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</sitemapindex>`;
}

export const sitemapXmlHeaders = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=3600",
} as const;
