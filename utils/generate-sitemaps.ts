/**
 * Write sitemap XML files to `static/` so they are served as plain files
 * (avoids dev-server CSS/HMR leaking into +server responses).
 *
 * Uses `<loc>` + `<lastmod>` only (Google-relevant fields).
 * Update `src/config/site-freshness.ts` before regenerating when content changes.
 */
import fs from "node:fs";
import path from "node:path";

import {
  getIconSitemapPaths,
  getMainSitemapPaths,
  getPackIconSitemapPaths,
} from "../src/config/site-pages.ts";
import { buildSitemapIndexXml, buildUrlsetXml } from "../src/utils/sitemap-xml.ts";

const STATIC_ROOT = path.resolve("static");
const SITEMAP_STYLESHEET =
  '<?xml-stylesheet type="text/xsl" href="/__sitemap__/style.xsl"?>\n';

function withStylesheet(xml: string): string {
  if (!xml.startsWith("<?xml")) return xml;
  const afterDecl = xml.indexOf("\n");
  if (afterDecl === -1) return xml;
  return xml.slice(0, afterDecl + 1) + SITEMAP_STYLESHEET + xml.slice(afterDecl + 1);
}

const files = [
  {
    name: "sitemap.xml",
    content: buildSitemapIndexXml([
      "/sitemap-main.xml",
      "/sitemap-icons.xml",
      "/sitemap-pack-icons.xml",
    ]),
  },
  { name: "sitemap-main.xml", content: buildUrlsetXml(getMainSitemapPaths()) },
  { name: "sitemap-icons.xml", content: buildUrlsetXml(getIconSitemapPaths()) },
  {
    name: "sitemap-pack-icons.xml",
    content: buildUrlsetXml(getPackIconSitemapPaths()),
  },
] as const;

function main() {
  for (const file of files) {
    const outPath = path.join(STATIC_ROOT, file.name);
    fs.writeFileSync(outPath, withStylesheet(file.content), "utf8");
    const urlCount =
      file.name === "sitemap.xml"
        ? 3
        : (file.content.match(/<loc>/g) ?? []).length;
    console.log(`  ${file.name} (${urlCount} entries/locs)`);
  }

  console.log(`Sitemaps written to ${STATIC_ROOT}`);
}

main();
