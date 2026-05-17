import type { IconPackMeta } from "@/types/icon-pack";
import type { PackIcon } from "@/types/icon-pack";

export function getPackIconDetailSeo(pack: IconPackMeta, icon: PackIcon) {
  return {
    title: `${icon.title} SVG — ${pack.name} | 5SVG`,
    description: `Free ${icon.title} SVG icon from ${pack.name}. Copy vector code or download the file. License: ${pack.license}.`,
    h1: `${icon.title} SVG`,
    lead: `Scalable vector icon from the ${pack.name} collection on 5SVG.`,
  } as const;
}
