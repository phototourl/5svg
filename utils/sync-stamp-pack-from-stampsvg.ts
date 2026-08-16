/**
 * Rebuild Stamp & Seal Pack from STAMPSVG/ with one naming rule:
 * lowercase kebab-case (no spaces, no "(1)", no EST._2019 style).
 *
 * Run: pnpm exec tsx utils/sync-stamp-pack-from-stampsvg.ts
 */
import {
  readdir,
  mkdir,
  readFile,
  writeFile,
  unlink,
  rename,
  access,
} from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "STAMPSVG");
const OUT = path.join(ROOT, "static", "shop", "files", "craft");

/** Explicit overrides when auto-slug would collide or be unclear. */
const SLUG_OVERRIDE: Record<string, string> = {
  // Circular seal vs rectangular address form — never use editstamp-1
  "editstamp (1).svg": "editstamp-address",
  "editstamp.svg": "editstamp",
  "est._2019.svg": "est-2019",
  "www.5svg.com.svg": "www-5svg-com",
};

const OLD_PACK_SLUGS = [
  "ex-libris",
  "aequitas-ltd",
  "ava-morgan-reed",
  "editstamp",
  "editstamp-1",
  "editstamp-address",
  "editstamp-studio",
  "engineering-design-drafting-services",
  "est-2019",
  "explore-and-grow",
  "harbor-desk-services",
  "harbor-food-export",
  "northbridge-design-build",
  "online-stamp-maker-seal-editor",
  "panama",
  "riverbend-medical",
  "save",
  "shelter-associates-ltd",
  "stamp",
  "www-5svg-com",
  "your-company-name",
];

function slugify(filename: string): string {
  const key = filename.toLowerCase();
  if (SLUG_OVERRIDE[key]) return SLUG_OVERRIDE[key];

  return filename
    .replace(/\.[^.]+$/i, "")
    .normalize("NFKD")
    .replace(/[^\w\s.-]+/g, "")
    .replace(/[.\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 80);
}

function tweakSvg(svg: string): string {
  let out = svg
    .replace(/<\?xml[^>]*>/i, "")
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .trim();
  if (!/data-source=/.test(out)) {
    out = out.replace(/<svg\b([^>]*)>/i, `<svg$1 data-source="5svg-stamp">`);
  } else {
    out = out.replace(
      /data-source="[^"]*"/i,
      'data-source="5svg-stamp"',
    );
  }
  return out;
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  // 1) Remove previous pack copies (including bad editstamp-1)
  for (const slug of OLD_PACK_SLUGS) {
    const p = path.join(OUT, `${slug}.svg`);
    if (await exists(p)) {
      await unlink(p);
      console.log(`DEL craft/${slug}.svg`);
    }
  }

  const listed = await readdir(SRC);
  const svgs = listed.filter((f) => f.toLowerCase().endsWith(".svg"));

  // 2) Rename sources in STAMPSVG to kebab-case via temp names (handles Windows case-only).
  const planned: { from: string; slug: string }[] = [];
  const used = new Set<string>();
  for (const file of svgs) {
    let slug = slugify(file);
    if (!slug) throw new Error(`Empty slug for ${file}`);
    if (used.has(slug)) {
      throw new Error(
        `Slug collision: "${slug}" from ${file}. Add SLUG_OVERRIDE.`,
      );
    }
    used.add(slug);
    planned.push({ from: file, slug });
  }

  for (const { from, slug } of planned) {
    const srcPath = path.join(SRC, from);
    const finalName = `${slug}.svg`;
    const finalPath = path.join(SRC, finalName);
    if (from === finalName) continue;
    const tmpPath = path.join(SRC, `${slug}.__tmp__.svg`);
    await rename(srcPath, tmpPath);
    // If target already exists as different entry, conflict — tmp keeps unique slug.
    await rename(tmpPath, finalPath);
    console.log(`REN STAMPSVG/${from} → ${finalName}`);
  }

  // 3) Copy STAMPSVG → craft (same filenames)
  const sources = (await readdir(SRC)).filter((f) =>
    f.toLowerCase().endsWith(".svg"),
  );
  const slugs: string[] = [];
  for (const file of sources.sort((a, b) => a.localeCompare(b))) {
    const slug = file.replace(/\.svg$/i, "");
    const raw = await readFile(path.join(SRC, file), "utf8");
    await writeFile(path.join(OUT, file), tweakSvg(raw), "utf8");
    slugs.push(slug);
    console.log(`OK craft/${file}`);
  }

  console.log("\n--- craft-catalog files() list ---");
  console.log(slugs.map((s) => `      "${s}",`).join("\n"));
  console.log(`\nTotal: ${slugs.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
