import fs from "node:fs";
import path from "node:path";

import { iconPacks } from "@/config/icon-packs";
import type { PackIndex } from "@/types/icon-pack";
import {
  getPackIconDetailHref,
  PACK_ICON_DETAIL_LIMIT,
} from "@/utils/pack-icon-paths";

export { PACK_ICON_DETAIL_LIMIT, getPackIconDetailHref };

export function getPackIconDetailPaths(): string[] {
  const paths: string[] = [];

  for (const pack of iconPacks) {
    const indexFile = path.join("static", pack.staticDir, "index.json");
    if (!fs.existsSync(indexFile)) continue;

    const index = JSON.parse(fs.readFileSync(indexFile, "utf8")) as PackIndex;
    for (const item of index.items.slice(0, PACK_ICON_DETAIL_LIMIT)) {
      paths.push(getPackIconDetailHref(pack.id, item.id));
    }
  }

  return paths;
}

export function findPackIcon(
  packId: string,
  iconId: string,
): { pack: (typeof iconPacks)[number]; icon: PackIndex["items"][number] } | null {
  const pack = iconPacks.find((p) => p.id === packId);
  if (!pack) return null;

  const indexFile = path.join("static", pack.staticDir, "index.json");
  if (!fs.existsSync(indexFile)) return null;

  const index = JSON.parse(fs.readFileSync(indexFile, "utf8")) as PackIndex;
  const decoded = decodeURIComponent(iconId);
  const icon = index.items.find((item) => item.id === decoded);
  if (!icon) return null;

  return { pack, icon };
}
