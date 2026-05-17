import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import { iconPackById, isIconPackId } from "@/config/icon-packs";
import type { PackIndex } from "@/types/icon-pack";

export const load: PageLoad = async ({ params, fetch }) => {
  if (!isIconPackId(params.pack)) {
    error(404, "Icon pack not found");
  }

  const meta = iconPackById[params.pack];
  const response = await fetch(meta.indexPath);

  if (!response.ok) {
    error(
      500,
      `Pack index missing. Run: pnpm build:pack-indexes (${meta.indexPath})`,
    );
  }

  const index = (await response.json()) as PackIndex;

  const featured = index.items.slice(0, 24);

  return {
    pack: meta,
    index,
    featured,
  };
};
