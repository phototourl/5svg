import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { getPackIconDetailSeo } from "@/config/pack-icon-detail-seo";
import { isIconPackId } from "@/config/icon-packs";
import { findPackIcon } from "@/utils/pack-icon-paths.server";

/** SSR at runtime — prerendering would parse multi‑MB pack indexes many times and OOM in Docker. */
export const prerender = false;

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
