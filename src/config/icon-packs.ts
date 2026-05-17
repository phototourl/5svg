import type { IconPackMeta } from "@/types/icon-pack";

/** External icon packs served from `static/{id}/` (not merged into `library/`). */
export const iconPacks = [
  {
    id: "bootstrap-icons",
    name: "Bootstrap Icons",
    description:
      "Official Bootstrap icon set — UI, arrows, devices, and common brand marks.",
    license: "MIT",
    staticDir: "bootstrap-icons",
    indexPath: "/bootstrap-icons/index.json",
  },
  {
    id: "font-awesome-7",
    name: "Font Awesome 7",
    description: "Font Awesome free SVGs — solid, regular, and brand styles.",
    license: "CC BY 4.0",
    staticDir: "font-awesome-7",
    indexPath: "/font-awesome-7/index.json",
  },
  {
    id: "react-icons",
    name: "React Icons",
    description:
      "Aggregated packs from react-icons sources (Simple Icons, Tabler, MDI, and more).",
    license: "See each upstream pack",
    staticDir: "react-icons",
    indexPath: "/react-icons/index.json",
  },
] as const satisfies readonly IconPackMeta[];

export type IconPackId = (typeof iconPacks)[number]["id"];

export const iconPackById = Object.fromEntries(
  iconPacks.map((pack) => [pack.id, pack]),
) as Record<IconPackId, (typeof iconPacks)[number]>;

export function isIconPackId(value: string): value is IconPackId {
  return value in iconPackById;
}
