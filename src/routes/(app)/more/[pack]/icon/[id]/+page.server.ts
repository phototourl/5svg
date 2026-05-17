import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { getPackIconDetailSeo } from "@/config/pack-icon-detail-seo";
import { isIconPackId } from "@/config/icon-packs";
import {
  findPackIcon,
  getPackIconDetailPaths,
} from "@/utils/pack-icon-paths.server";

/** Only prerender when pack `index.json` exists (skipped in Docker without gitignored assets). */
const packIconPrerenderEntries = getPackIconDetailPaths().map((path) => {
  const match = path.match(/^\/more\/([^/]+)\/icon\/(.+)$/);
  if (!match) throw new Error(`Invalid pack icon path: ${path}`);
  return { pack: match[1], id: decodeURIComponent(match[2]) };
});

export const prerender = packIconPrerenderEntries.length > 0;

export function entries() {
  return packIconPrerenderEntries;
}

export const load: PageServerLoad = ({ params }) => {
  if (!isIconPackId(params.pack)) {
    error(404, "Pack not found");
  }

  const found = findPackIcon(params.pack, params.id);
  if (!found) {
    error(404, "Icon not found");
  }

  return {
    pack: found.pack,
    icon: found.icon,
    seo: getPackIconDetailSeo(found.pack, found.icon),
  };
};
