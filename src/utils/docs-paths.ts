import fs from "node:fs";
import path from "node:path";

import { brand } from "@/brand";

const DOCS_ROOT = path.resolve("src/docs");

/** Doc routes for sitemap / prerender lists (no content-collections build required). */
export function getDocsPaths(): string[] {
  if (!fs.existsSync(DOCS_ROOT)) return [];

  return fs
    .readdirSync(DOCS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.replace(/\.md$/i, ""))
    .filter((slug) => brand.showDeveloperTools || slug !== "shadcn-ui")
    .map((slug) => `/docs/${slug}`);
}
