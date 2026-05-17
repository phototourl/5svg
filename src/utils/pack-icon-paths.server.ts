import { iconPacks } from "@/config/icon-packs";
import type { PackIndex } from "@/types/icon-pack";
import { readPackIndex } from "@/utils/pack-index.server";
import {
  getPackIconDetailHref,
  PACK_ICON_DETAIL_LIMIT,
} from "@/utils/pack-icon-paths";

export { PACK_ICON_DETAIL_LIMIT, getPackIconDetailHref };

export function getPackIconDetailPaths(): string[] {
  const paths: string[] = [];

  for (const pack of iconPacks) {
    const index = readPackIndex(pack.staticDir);
    if (!index) continue;
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

  const index = readPackIndex(pack.staticDir);
  if (!index) return null;
  const decoded = decodeURIComponent(iconId);
  const icon = index.items.find((item) => item.id === decoded);
  if (!icon) return null;

  return { pack, icon };
}
