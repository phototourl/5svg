import type { IconPackMeta } from "@/types/icon-pack";

export function getPackPageSeo(pack: IconPackMeta, count: number) {
  return {
    h1: `${pack.name} SVG icons`,
    lead: `Browse ${count.toLocaleString()} free SVG icons from ${pack.name}. Search, copy, or download files. License: ${pack.license}.`,
    featuredHeading: `Sample ${pack.name} icons`,
    featuredNote:
      "A searchable sample from this pack. Use search above to find more icons in the grid.",
  } as const;
}
