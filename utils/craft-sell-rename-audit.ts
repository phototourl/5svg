/**
 * One-shot map used when normalizing craft sell filenames (Aug 2026).
 * Keep for audit — do not re-run blindly after files already renamed.
 *
 * Convention: lowercase kebab-case; no bare digits (1.svg); no png.svg/svg.svg.
 */
export const CRAFT_SELL_RENAME_AUDIT: Record<string, string> = {
  "1": "shape-raster-cut-01",
  "4": "shape-ornament-medallion-a",
  "6": "shape-raster-cut-06",
  "7": "shape-ornament-medallion-b",
  "9": "shape-raster-cut-09",
  "12": "family-numeral-12",
  png: "shape-raster-from-png",
  svg: "shape-vector-mark",
  "fabrica-2": "fabrica-monogram",
  "ears-41": "animal-ears",
  hellomynameis2: "hello-my-name-is",
  baseballmom: "baseball-mom",
  "mamas-boy-01": "mamas-boy",
  sun3: "sun-burst",
  love: "love-script",
  "tree-1": "christmas-tree-01",
  "tree-4": "christmas-tree-04",
  "tree-13": "christmas-tree-13",
  "tree-24": "christmas-tree-24",
  "sweaters-2": "christmas-sweater-02",
  "sweaters-9": "christmas-sweater-09",
  "christmas-truck-1": "christmas-truck-01",
  "christmas-star-5": "christmas-star-05",
  "ghost-2-grunge": "halloween-ghost-grunge",
  "bad-witch-retro-pink-witches-halloween-t-shirt-design":
    "halloween-bad-witch",
  "fall-gnome-svg-fill": "fall-gnome-fill",
  "fall-gnome-svg-outline": "fall-gnome-outline",
  "fall-gnome-png-transparent-file": "fall-gnome-transparent",
  "live-life-in-full-bloom-sublimation": "live-life-in-full-bloom",
  "autumn-flowers-and-leaves-pattern": "autumn-flowers-leaves",
  "autumn-flowers-and-leaves-pattern-black-version":
    "autumn-flowers-leaves-black",
  "mental-health-svg-design": "mental-health-design",
  "mental-health-svg-design-01": "mental-health-design-01",
};
