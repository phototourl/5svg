import { brand } from "@/brand";
import { getPublicPagePaths } from "@/config/site-pages";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const changefreqByPath = (path: string): "daily" | "weekly" | "monthly" => {
  if (path === "/" || path === "/library") return "daily";
  if (path.startsWith("/directory/")) return "weekly";
  return "monthly";
};

const priorityByPath = (path: string): string => {
  if (path === "/") return "1.0";
  if (path === "/library") return "0.9";
  if (path.startsWith("/directory/")) return "0.8";
  if (path === "/favorites") return "0.5";
  return "0.6";
};

function urlEntry(path: string): string {
  const loc = `${siteUrl}${path}`;
  const changefreq = changefreqByPath(path);
  const priority = priorityByPath(path);
  return `  <url><loc>${escapeXml(loc)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function GET() {
  const paths = getPublicPagePaths();
  const urls = paths.map(urlEntry);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
