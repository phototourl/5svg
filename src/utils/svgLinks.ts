import type { iSVG } from "@/types/svg";

/** Link to a single SVG in the library (search by title). */
export function getSvgLibraryHref(svg: Pick<iSVG, "title">): string {
  return `/library?search=${encodeURIComponent(svg.title.trim())}`;
}

export function getCategoryHref(category: string): string {
  return `/directory/${encodeURI(category.toLowerCase())}`;
}
