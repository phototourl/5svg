/**
 * Rasterize main-library logos to PNG for Open Graph / Twitter previews.
 * Output: static/og/icons/{slug}.png (512×512, light background)
 */
import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

import { getIndexableIconSlugs, getSvgBySlug } from "../src/data/index.ts";
import { getPrimaryRoutePath } from "../src/utils/svg-slug.ts";

const STATIC_ROOT = path.resolve("static");
const OUT_DIR = path.join(STATIC_ROOT, "og", "icons");
const PNG_SIZE = 512;
const PAD = 48;

function resolveStaticSvg(routePath: string): string | null {
  const relative = routePath.replace(/^\//, "");
  const filePath = path.join(STATIC_ROOT, relative);
  return fs.existsSync(filePath) ? filePath : null;
}

function renderOgPng(svgFilePath: string): Buffer | null {
  try {
    const svg = fs.readFileSync(svgFilePath);
    const innerSize = PNG_SIZE - PAD * 2;
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: innerSize },
      background: "#f5f5f4",
    });
    return Buffer.from(resvg.render().asPng());
  } catch (error) {
    console.warn(`  skip render: ${svgFilePath}`, error);
    return null;
  }
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const slugs = getIndexableIconSlugs();
  let written = 0;
  let skipped = 0;

  for (const slug of slugs) {
    const entry = getSvgBySlug(slug);
    if (!entry) {
      skipped++;
      continue;
    }

    const routePath = getPrimaryRoutePath(entry);
    if (!routePath) {
      skipped++;
      continue;
    }

    const svgPath = resolveStaticSvg(routePath);
    if (!svgPath) {
      console.warn(`  missing file: ${routePath}`);
      skipped++;
      continue;
    }

    const png = renderOgPng(svgPath);
    if (!png) {
      skipped++;
      continue;
    }

    fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), png);
    written++;
  }

  console.log(`OG icons: ${written} written, ${skipped} skipped → ${OUT_DIR}`);
}

main();
