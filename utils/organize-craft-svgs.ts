/**
 * Normalize craft SVGs from svg/ → static/shop/files/craft/
 * Skips known third-party IP filenames. Adds data-source marker.
 */
import { readdir, mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "svg");
const OUT = path.join(ROOT, "static", "shop", "files", "craft");

/** Filenames / patterns we will not sell or catalog (third-party IP). */
const BLOCK = [
  /minecraft/i,
  /starwars|star.?wars/i,
  /olaf/i,
  /penny.?wise/i,
  /disney/i,
];

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

function isBlocked(name: string): boolean {
  return BLOCK.some((re) => re.test(name));
}

function tweakSvg(svg: string): string {
  let out = svg
    .replace(/<\?xml[^>]*>/i, "")
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .trim();
  if (!/data-source=/.test(out)) {
    out = out.replace(/<svg\b([^>]*)>/i, `<svg$1 data-source="5svg-craft">`);
  }
  return out;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const files = await readdir(SRC);
  const svgs = files.filter((f) => f.toLowerCase().endsWith(".svg"));

  const manifest: {
    slug: string;
    source: string;
    path: string;
    blocked?: boolean;
  }[] = [];

  for (const file of svgs) {
    if (isBlocked(file)) {
      console.log(`SKIP IP: ${file}`);
      manifest.push({
        slug: slugify(file),
        source: file,
        path: "",
        blocked: true,
      });
      continue;
    }
    const slug = slugify(file) || `craft-${Date.now()}`;
    const outName = `${slug}.svg`;
    const outPath = path.join(OUT, outName);
    const raw = await readFile(path.join(SRC, file), "utf8");
    await writeFile(outPath, tweakSvg(raw), "utf8");
    console.log(`OK ${file} → ${outName}`);
    manifest.push({
      slug,
      source: file,
      path: `/shop/files/craft/${outName}`,
    });
  }

  // Also list converted rasters already in OUT
  const outFiles = await readdir(OUT);
  for (const f of outFiles) {
    if (!f.endsWith(".svg")) continue;
    const slug = f.replace(/\.svg$/, "");
    if (manifest.some((m) => m.slug === slug)) continue;
    manifest.push({
      slug,
      source: `converted:${f}`,
      path: `/shop/files/craft/${f}`,
    });
  }

  await writeFile(
    path.join(OUT, "_manifest.json"),
    JSON.stringify(manifest.filter((m) => !m.blocked), null, 2),
    "utf8",
  );
  console.log(`Manifest: ${manifest.filter((m) => !m.blocked).length} assets`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
