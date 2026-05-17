import type { PageLoad } from "./$types";

import { getCategoryStats, getFamousBrandPreviewSvgs } from "@/data";
import { getBrowseIcons, groupBrowseIconsByLetter } from "@/utils/browse-index";

export const prerender = true;

export const load: PageLoad = () => {
  const icons = getBrowseIcons();

  return {
    total: icons.length,
    byLetter: groupBrowseIconsByLetter(icons),
    popular: getFamousBrandPreviewSvgs(12),
    categories: getCategoryStats(12),
  };
};
