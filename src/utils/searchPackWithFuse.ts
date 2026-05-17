import type { PackIcon } from "@/types/icon-pack";
import Fuse from "fuse.js";

export const searchPackIconsWithFuse = (items: PackIcon[]) =>
  new Fuse<PackIcon>(items, {
    keys: ["title", "id"],
    threshold: 0.35,
    ignoreLocation: true,
    isCaseSensitive: false,
    shouldSort: true,
  });
