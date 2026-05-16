import { brand } from "@/brand";
import { getCategories, getSvgsByCategory } from "@/data";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function categoryPath(category: string): string {
  return `/directory/${encodeURI(category.toLowerCase())}`;
}

function urlEntry(
  path: string,
  changefreq: "daily" | "weekly" | "monthly" = "weekly",
  priority = "0.7",
): string {
  const loc = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return `  <url><loc>${escapeXml(loc)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

/** Paths that are linked in nav and safe to index (no duplicate / hidden docs). */
const publicPaths: Array<{
  path: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/library", changefreq: "daily", priority: "0.9" },
  { path: "/favorites", changefreq: "weekly", priority: "0.5" },
];

export function GET() {
  const seen = new Set<string>();
  const urls: string[] = [];

  const add = (
    path: string,
    changefreq: "daily" | "weekly" | "monthly",
    priority: string,
  ) => {
    const loc = `${siteUrl}${path}`;
    if (seen.has(loc)) return;
    seen.add(loc);
    urls.push(urlEntry(path, changefreq, priority));
  };

  for (const entry of publicPaths) {
    add(entry.path, entry.changefreq, entry.priority);
  }

  for (const category of getCategories()) {
    if (getSvgsByCategory(category).length === 0) continue;
    add(categoryPath(category), "weekly", "0.8");
  }

  if (brand.showApiNav) {
    add("/docs/api", "monthly", "0.6");
  }

  if (brand.showDeveloperTools) {
    add("/extensions", "monthly", "0.5");
    add("/docs/shadcn-ui", "monthly", "0.5");
  }

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
