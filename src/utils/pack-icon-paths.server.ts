import fs from "node:fs";
import path from "node:path";

import { iconPacks } from "../config/icon-packs";
import type { PackIndex } from "../types/icon-pack";
import { getPackIconSitemapPathsFromDisk } from "../config/site-pages";
import {
  getPackIconDetailHref,
  PACK_ICON_DETAIL_LIMIT,
} from "./pack-icon-paths";

export { PACK_ICON_DETAIL_LIMIT, getPackIconDetailHref };

function packIndexCandidates(staticDir: string): string[] {
  return [
    path.join(process.cwd(), "build/client", staticDir, "index.json"),
    path.join(process.cwd(), "static", staticDir, "index.json"),
  ];
}

export function readPackIndex(staticDir: string): PackIndex | null {
  for (const file of packIndexCandidates(staticDir)) {
    if (!fs.existsSync(file)) continue;
    try {
      return JSON.parse(fs.readFileSync(file, "utf8")) as PackIndex;
    } catch {
      return null;
    }
  }
  return null;
}

export function isPackDeployed(staticDir: string): boolean {
  return readPackIndex(staticDir) !== null;
}

/** Same paths as sitemap (re-export for prerender `entries()`). */
export function getPackIconDetailPaths(): string[] {
  return getPackIconSitemapPathsFromDisk();
}

export function findPackIcon(
  packId: string,
  iconId: string,
): { pack: (typeof iconPacks)[number]; icon: PackIndex["items"][number] } | null {
  const pack = iconPacks.find((p) => p.id === packId);
  if (!pack) return null;

  const index = readPackIndex(pack.staticDir);
  if (!index) return null;
  const decoded = decodeURIComponent(iconId);
  const icon = index.items.find((item) => item.id === decoded);
  if (!icon) return null;

  return { pack, icon };
}
