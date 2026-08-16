/**
 * Convert raster images in svg/ → SVG under static/shop/files/craft/
 * Usage: pnpm exec tsx utils/raster-to-svg.ts
 */
import { readdir, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
// @ts-expect-error no types
import ImageTracer from "imagetracerjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "svg");
const OUT = path.join(ROOT, "static", "shop", "files", "craft");

const RASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const MAX_EDGE = 1000;

/** Already rebuilt with illustration preset — skip unless --all */
const SKIP_ALREADY_DONE = [/^Distressed USA Flag-/i];

function shouldSkip(file: string, forceAll: boolean): boolean {
  if (forceAll) return false;
  return SKIP_ALREADY_DONE.some((re) => re.test(file));
}

function slugify(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 80);
}

async function convertOne(file: string): Promise<string | null> {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER_EXT.has(ext)) return null;

  const input = path.join(SRC, file);
  const base = slugify(file) || `asset-${Date.now()}`;
  const outPath = path.join(OUT, `${base}.svg`);

  const meta = await sharp(input).metadata();
  const w = meta.width ?? MAX_EDGE;
  const h = meta.height ?? MAX_EDGE;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));

  const { data, info } = await sharp(input)
    .resize({
      width: Math.max(1, Math.round(w * scale)),
      height: Math.max(1, Math.round(h * scale)),
      fit: "inside",
      withoutEnlargement: true,
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const imageData = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(data),
  };

  // illustration-like options: posterized3 drops brush detail (incomplete flags)
  let svg: string = ImageTracer.imagedataToSVG(imageData, {
    numberofcolors: 24,
    pathomit: 2,
    ltres: 0.4,
    qtres: 0.4,
    blurradius: 0,
    strokewidth: 0,
    scale: 1,
  });

  // Light content tweak: strip XML/doctype noise, add 5svg marker comment
  svg = svg
    .replace(/<\?xml[^>]*>/i, "")
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .trim();
  if (!svg.includes("data-source")) {
    svg = svg.replace(
      /<svg\b([^>]*)>/i,
      `<svg$1 data-source="5svg-converted">`,
    );
  }

  await writeFile(outPath, svg, "utf8");
  return outPath;
}

async function main() {
  const forceAll = process.argv.includes("--all");
  await mkdir(OUT, { recursive: true });
  const files = await readdir(SRC);
  const rasters = files.filter((f) => RASTER_EXT.has(path.extname(f).toLowerCase()));

  console.log(`Found ${rasters.length} raster files → ${OUT}`);
  if (!forceAll) {
    console.log("Skipping Distressed USA Flag-* (already done). Pass --all to force.");
  }

  const results: { file: string; out?: string; error?: string; skipped?: boolean }[] = [];
  for (const file of rasters) {
    if (shouldSkip(file, forceAll)) {
      console.log(`SKIP (done): ${file}`);
      results.push({ file, skipped: true });
      continue;
    }
    process.stdout.write(`Converting ${file} ... `);
    const started = Date.now();
    try {
      const out = await convertOne(file);
      console.log(`ok (${((Date.now() - started) / 1000).toFixed(1)}s)`);
      results.push({ file, out: out ?? undefined });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`FAIL: ${msg}`);
      results.push({ file, error: msg });
    }
  }

  await writeFile(
    path.join(OUT, "_convert-report.json"),
    JSON.stringify(results, null, 2),
    "utf8",
  );
  console.log("Done. Report: static/shop/files/craft/_convert-report.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
