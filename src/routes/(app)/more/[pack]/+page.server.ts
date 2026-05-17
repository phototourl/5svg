import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { iconPackById, isIconPackId } from "@/config/icon-packs";
import { readPackIndex } from "@/utils/pack-icon-paths.server";

export const prerender = false;

export const load: PageServerLoad = ({ params }) => {
  if (!isIconPackId(params.pack)) {
    error(404, "Icon pack not found");
  }

  const pack = iconPackById[params.pack];
  const index = readPackIndex(pack.staticDir);

  if (!index) {
    error(
      503,
      `Icon pack files are not on this server (${pack.indexPath}). ` +
        "Add static/{pack}/ to git or mount them on the container — see static/IMPORTED-SOURCES.md.",
    );
  }

  return {
    pack,
    index,
    featured: index.items.slice(0, 24),
  };
};
