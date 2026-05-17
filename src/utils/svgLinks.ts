import type { iSVG } from "@/types/svg";
import { getIconHref } from "@/utils/svg-slug";

/** Link to icon detail page, or library search fallback. */
export function getSvgLibraryHref(svg: Pick<iSVG, "route" | "title">): string {
  return getIconHref(svg);
}

export function getCategoryHref(category: string): string {
  return `/directory/${encodeURI(category.toLowerCase())}`;
}
