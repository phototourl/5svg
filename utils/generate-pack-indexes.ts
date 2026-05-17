import fs from "fs";
import path from "path";

import { iconPacks } from "../src/config/icon-packs";
import type { PackIcon, PackIndex } from "../src/types/icon-pack";

const STATIC_ROOT = path.resolve("static");

function humanizeFilename(filename: string): string {
  const base = filename.replace(/\.svg$/i, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toId(relativePath: string): string {
  return relativePath
    .replace(/\.svg$/i, "")
    .replace(/[/\\]+/g, "--")
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .toLowerCase();
}

function walkSvgFiles(dir: string, baseDir: string, out: PackIcon[]): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSvgFiles(full, baseDir, out);
      continue;
    }
    if (!entry.name.toLowerCase().endsWith(".svg")) continue;

    const relative = path.relative(baseDir, full).replace(/\\/g, "/");
    const urlPath = `/${path.posix.join(path.basename(baseDir), relative)}`;
    out.push({
      id: toId(relative),
      title: humanizeFilename(entry.name),
      path: urlPath,
    });
  }
}

function buildIndex(packId: string, staticDir: string): PackIndex {
  const packRoot = path.join(STATIC_ROOT, staticDir);
  const items: PackIcon[] = [];
  walkSvgFiles(packRoot, packRoot, items);
  items.sort((a, b) => a.title.localeCompare(b.title));

  return { packId, count: items.length, items };
}

async function main() {
  let built = 0;
  let skipped = 0;

  for (const pack of iconPacks) {
    const packRoot = path.join(STATIC_ROOT, pack.staticDir);
    if (!fs.existsSync(packRoot)) {
      skipped += 1;
      console.warn(
        `[skip] ${pack.id}: directory missing (${packRoot}). ` +
          "Icon packs are not in git — copy static/{pack}/ onto the server or into the build context, then rerun.",
      );
      continue;
    }

    const index = buildIndex(pack.id, pack.staticDir);
    const outPath = path.join(STATIC_ROOT, pack.staticDir, "index.json");
    await fs.promises.writeFile(outPath, JSON.stringify(index), "utf-8");
    built += 1;
    console.log(`[ok] ${pack.id}: ${index.count} icons -> ${outPath}`);
  }

  if (built === 0 && skipped > 0) {
    console.warn(
      `[warn] No pack indexes built (${skipped} skipped). Main library build can continue; /more/* packs need assets on disk.`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
