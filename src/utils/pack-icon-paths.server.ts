import { iconPacks } from "../config/icon-packs";
import type { PackIndex } from "../types/icon-pack";
import { getPackIconSitemapPathsFromDisk } from "../config/pack-sitemap-paths";
import { readPackIndex } from "./pack-index.server";
import {
  getPackIconDetailHref,
  PACK_ICON_DETAIL_LIMIT,
} from "./pack-icon-paths";

export { PACK_ICON_DETAIL_LIMIT, getPackIconDetailHref };

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
