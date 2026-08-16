/**
 * Crop viewBox to path bounds + set fill for monochrome craft SVGs.
 * Usage: pnpm exec tsx utils/fix-craft-svg-viewbox.ts [file...]
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CRAFT = path.join(ROOT, "static", "shop", "files", "craft");

type Pt = { x: number; y: number };

function parsePathBounds(d: string): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let x = 0,
    y = 0;
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g) || [];
  let i = 0;
  const num = () => Number(tokens[i++]);
  const add = (px: number, py: number) => {
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);
    minY = Math.min(minY, py);
    maxY = Math.max(maxY, py);
  };

  while (i < tokens.length) {
    const op = tokens[i++];
    if (!op) break;
    const abs = op === op.toUpperCase();
    const o = op.toUpperCase();

    const readPair = (): Pt => {
      const a = num();
      const b = num();
      if (abs) return { x: a, y: b };
      return { x: x + a, y: y + b };
    };

    if (o === "Z") continue;
    if (o === "M" || o === "L") {
      while (i < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i]!)) {
        const p = readPair();
        x = p.x;
        y = p.y;
        add(x, y);
        if (o === "M") {
          // subsequent pairs are treated as L in SVG
        }
      }
      continue;
    }
    if (o === "H") {
      while (i < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i]!)) {
        const a = num();
        x = abs ? a : x + a;
        add(x, y);
      }
      continue;
    }
    if (o === "V") {
      while (i < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i]!)) {
        const a = num();
        y = abs ? a : y + a;
        add(x, y);
      }
      continue;
    }
    if (o === "C") {
      while (i < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i]!)) {
        const p1 = readPair();
        const p2 = readPair();
        const p3 = readPair();
        add(p1.x, p1.y);
        add(p2.x, p2.y);
        add(p3.x, p3.y);
        x = p3.x;
        y = p3.y;
      }
      continue;
    }
    // skip unsupported commands' numbers until next op
    while (i < tokens.length && !/^[MmLlHhVvCcSsQqTtAaZz]$/.test(tokens[i]!)) i++;
  }

  return { minX, minY, maxX, maxY };
}

async function fixFile(file: string, fill: string) {
  const abs = path.isAbsolute(file) ? file : path.join(CRAFT, file);
  let svg = await readFile(abs, "utf8");
  const paths = [...svg.matchAll(/\bd="([^"]+)"/g)].map((m) => m[1]!);
  if (paths.length === 0) throw new Error(`no paths in ${file}`);

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const d of paths) {
    const b = parsePathBounds(d);
    minX = Math.min(minX, b.minX);
    minY = Math.min(minY, b.minY);
    maxX = Math.max(maxX, b.maxX);
    maxY = Math.max(maxY, b.maxY);
  }

  const pad = 24;
  minX = Math.floor(minX - pad);
  minY = Math.floor(minY - pad);
  maxX = Math.ceil(maxX + pad);
  maxY = Math.ceil(maxY + pad);
  const w = maxX - minX;
  const h = maxY - minY;
  const viewBox = `${minX} ${minY} ${w} ${h}`;

  svg = svg.replace(/\sviewBox="[^"]*"/i, ` viewBox="${viewBox}"`);
  if (!/\sviewBox=/i.test(svg)) {
    svg = svg.replace(/<svg\b/i, `<svg viewBox="${viewBox}"`);
  }

  // colorize monochrome craft cut files
  if (/<g\b/.test(svg) && !/fill=/.test(svg.slice(0, 500))) {
    svg = svg.replace(/<g(\s|>)/, `<g fill="${fill}"$1`);
  } else if (!/\sfill=/.test(svg)) {
    svg = svg.replace(/<svg\b([^>]*)>/i, `<svg$1 fill="${fill}">`);
  } else {
    svg = svg.replace(/fill="[^"]*"/i, `fill="${fill}"`);
  }

  // drop fixed canvas attrs that fight cropped viewBox
  svg = svg.replace(/\s(x|y|width|height)="[^"]*"/gi, (m) =>
    /width|height|x|y/i.test(m) && !/viewBox/i.test(m) ? "" : m,
  );

  await writeFile(abs, svg, "utf8");
  console.log(`${path.basename(abs)} → viewBox="${viewBox}" fill=${fill}`);
}

const files = process.argv.slice(2);
const targets =
  files.length > 0 ? files : ["distressed-american-flag.svg"];

for (const f of targets) {
  await fixFile(f, "#C8102E"); // classic flag red for preview / default vinyl look
}
