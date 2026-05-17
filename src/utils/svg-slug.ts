import type { iSVG } from "@/types/svg";

/** Primary static asset path for an SVG entry. */
export function getPrimaryRoutePath(svg: Pick<iSVG, "route">): string | null {
  if (!svg.route) return null;
  if (typeof svg.route === "string") return svg.route;
  return svg.route.light ?? svg.route.dark ?? null;
}

/** URL slug from library filename, e.g. `/library/discord.svg` → `discord`. */
export function getSvgSlug(svg: Pick<iSVG, "route">): string | null {
  const path = getPrimaryRoutePath(svg);
  if (!path) return null;

  const file = path.split("/").pop();
  if (!file?.toLowerCase().endsWith(".svg")) return null;

  return file.slice(0, -4);
}

export function getIconHref(svg: Pick<iSVG, "route" | "title">): string {
  const slug = getSvgSlug(svg);
  return slug
    ? `/icon/${encodeURIComponent(slug)}`
    : `/library?search=${encodeURIComponent(svg.title.trim())}`;
}
