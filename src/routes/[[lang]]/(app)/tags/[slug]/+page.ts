import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import { tagPages, isTagSlug } from "@/config/tag-pages";
import { getSvgsByCategory } from "@/data";

export const prerender = true;

export function entries() {
  return tagPages.map((tag) => ({ slug: tag.slug }));
}

export const load: PageLoad = ({ params }) => {
  if (!isTagSlug(params.slug)) {
    error(404, "Topic not found");
  }

  const tag = tagPages.find((t) => t.slug === params.slug)!;
  const category = "category" in tag ? tag.category : undefined;
  const svgs = category ? getSvgsByCategory(category) : [];

  return {
    tag,
    category,
    svgs: svgs.slice(0, 48),
    total: svgs.length,
  };
};
