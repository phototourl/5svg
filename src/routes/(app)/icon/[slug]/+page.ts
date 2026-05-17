import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import { getIconDetailSeo } from "@/config/icon-detail-seo";
import { getIndexableIconSlugs, getRelatedSvgs, getSvgBySlug } from "@/data";

export const prerender = true;

export function entries() {
  return getIndexableIconSlugs().map((slug) => ({ slug }));
}

export const load: PageLoad = ({ params }) => {
  const svg = getSvgBySlug(params.slug);

  if (!svg) {
    error(404, "SVG not found");
  }

  return {
    svg,
    related: getRelatedSvgs(svg),
    seo: getIconDetailSeo(svg),
  };
};
