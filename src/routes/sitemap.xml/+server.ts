import { brand } from "@/brand";
import { getCategories } from "@/data";
import { allDocs } from "content-collections";

const siteUrl = brand.siteUrl.replace(/\/+$/, "");

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(
  path: string,
  changefreq: "daily" | "weekly" | "monthly" = "weekly",
  priority = "0.7",
): string {
  const loc = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
  return `  <url><loc>${escapeXml(loc)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function GET() {
  const urls: string[] = [
    urlEntry("/", "daily", "1.0"),
    urlEntry("/library", "daily", "0.9"),
    urlEntry("/favorites", "weekly", "0.5"),
  ];

  for (const category of getCategories()) {
    urls.push(urlEntry(`/directory/${category.toLowerCase()}`, "weekly", "0.8"));
  }

  if (brand.showApiNav) {
    urls.push(urlEntry("/docs/api", "monthly", "0.6"));
  }

  if (brand.showDeveloperTools) {
    urls.push(urlEntry("/extensions", "monthly", "0.5"));
    urls.push(urlEntry("/docs/shadcn-ui", "monthly", "0.5"));
  }

  for (const doc of allDocs) {
    urls.push(urlEntry(`/docs/${doc._meta.path}`, "monthly", "0.5"));
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
