import type { ShopFile, ShopProduct } from "./types";

/** Client-safe catalog (no node:fs). Cover: static/banner-logo.png */
function files(...slugs: string[]): ShopFile[] {
  return slugs.map((slug) => ({
    path: `/shop/files/craft/${slug}.svg`,
    filename: `${slug}.svg`,
  }));
}

function pack(
  partial: Omit<ShopProduct, "kind" | "status" | "license" | "fileCount" | "id"> & {
    files: ShopFile[];
  },
): ShopProduct {
  return {
    ...partial,
    id: partial.slug,
    kind: "craft",
    status: "live",
    license: "personal",
    fileCount: partial.files.length,
    previewPath: partial.previewPath || partial.files[0]!.path,
  };
}

/**
 * Craft packs: existing assets + 5svg original geometric cut files
 * (utils/generate-craft-expansions.ts). Target ~22–24 files each.
 * Whole Shop Bundle ($9.90) aggregates every pack — 8svg-style value SKU.
 */
const INDIVIDUAL_CRAFT_PACKS: ShopProduct[] = [
  pack({
    slug: "craft-halloween-pack",
    title: "Halloween Craft Pack",
    description:
      "22 Halloween cut files — ghosts, bats, pumpkins, webs, and keychain shapes for vinyl and shirts.",
    category: "Halloween",
    priceCents: 450,
    compareAtCents: 1499,
    files: files(
      "halloween-ghost-grunge",
      "halloween-ghost-simple",
      "halloween-bad-witch",
      "halloween-witch-hat",
      "halloween-keychain-19",
      "halloween-keychain-20",
      "halloween-keychain-ring",
      "halloween-bat-silhouette",
      "halloween-moon-crescent",
      "halloween-pumpkin-simple",
      "halloween-spider-web",
      "halloween-spider",
      "halloween-cat-silhouette",
      "halloween-candy-corn",
      "halloween-skull-simple",
      "halloween-tombstone",
      "halloween-broom",
      "halloween-cauldron",
      "halloween-star-burst",
      "halloween-owl",
      "halloween-raven",
      "halloween-candle",
    ),
    tags: ["halloween", "craft", "seasonal"],
  }),
  pack({
    slug: "craft-christmas-pack",
    title: "Christmas Craft Pack",
    description:
      "23 Christmas cut files — trees, trucks, ornaments, snowflakes, and holiday accents.",
    category: "Christmas",
    priceCents: 450,
    compareAtCents: 1499,
    files: files(
      "christmas-truck-01",
      "christmas-truck-14",
      "christmas-truck-22",
      "christmas-tree-01",
      "christmas-tree-04",
      "christmas-tree-13",
      "christmas-tree-24",
      "christmas-tree-simple",
      "christmas-sweater-02",
      "christmas-sweater-09",
      "christmas-star-05",
      "christmas-ornament",
      "christmas-bell",
      "christmas-candy-cane",
      "christmas-gift-box",
      "christmas-holly",
      "christmas-snowflake",
      "christmas-stocking",
      "christmas-wreath",
      "christmas-reindeer-head",
      "christmas-mitten",
      "christmas-gingerbread",
      "sun-burst",
    ),
    tags: ["christmas", "craft", "holiday"],
  }),
  pack({
    slug: "craft-fall-pack",
    title: "Fall & Autumn Pack",
    description:
      "21 fall cut files — leaves, gnomes, harvest shapes, and autumn accents for vinyl and print.",
    category: "Fall",
    priceCents: 450,
    compareAtCents: 1499,
    files: files(
      "autumn-flowers-leaves",
      "autumn-flowers-leaves-black",
      "fall-gnome-fill",
      "fall-gnome-outline",
      "fall-gnome-clipart-sublimation",
      "fall-gnome-coloring-page",
      "live-life-in-full-bloom",
      "fall-maple-leaf",
      "fall-oak-leaf",
      "fall-acorn",
      "fall-pumpkin-outline",
      "fall-wheat",
      "fall-mushroom",
      "fall-fox-face",
      "fall-sunflower",
      "fall-leaf-pair",
      "fall-harvest-basket",
      "fall-scarecrow-hat",
      "fall-pinecone",
      "fall-crow",
      "fall-apple",
    ),
    tags: ["fall", "autumn", "gnome", "craft"],
  }),
  pack({
    slug: "craft-patriotic-pack",
    title: "Patriotic Flag Pack",
    description:
      "20 patriotic cut files — flags, stars, badges, and banner shapes for vinyl crafts.",
    category: "Patriotic",
    priceCents: 450,
    compareAtCents: 1299,
    files: files(
      "distressed-american-flag",
      "distressed-usa-flag-01",
      "distressed-usa-flag-02",
      "distressed-usa-flag-03",
      "distressed-usa-flag-04",
      "american-glassers",
      "patriotic-star-single",
      "patriotic-star-row",
      "patriotic-banner",
      "patriotic-shield",
      "patriotic-eagle-simple",
      "patriotic-stripes-block",
      "patriotic-circle-stars",
      "patriotic-heart-star",
      "patriotic-laurel",
      "patriotic-burst",
      "patriotic-badge",
      "patriotic-ribbon",
      "patriotic-anchor",
      "patriotic-flame",
    ),
    tags: ["flag", "patriotic", "craft"],
  }),
  pack({
    slug: "craft-family-labels-pack",
    title: "Family & Labels Pack",
    description:
      "21 family and label cut files — name frames, monograms, tags, and school accents.",
    category: "Family",
    priceCents: 450,
    compareAtCents: 1299,
    files: files(
      "pencil-name-frame",
      "hello-my-name-is",
      "mamas-boy",
      "baseball-mom",
      "number-12",
      "family-numeral-12",
      "family-heart-frame",
      "family-circle-monogram",
      "family-banner-name",
      "family-house",
      "family-baby-feet",
      "family-ring",
      "family-arrow-split",
      "family-school-apple",
      "family-star-name",
      "family-bookmark",
      "family-tag",
      "family-camera",
      "family-key",
      "family-paw",
      "family-graduation",
    ),
    tags: ["family", "labels", "school", "craft"],
  }),
  pack({
    slug: "craft-wellness-love-pack",
    title: "Wellness & Love Pack",
    description:
      "19 wellness and love cut files — hearts, calm icons, nature accents, and encouragement shapes.",
    category: "Wellness",
    priceCents: 450,
    compareAtCents: 1299,
    files: files(
      "mental-health-design",
      "mental-health-design-01",
      "love-script",
      "wellness-heart",
      "wellness-heart-outline",
      "wellness-lotus",
      "wellness-yoga",
      "wellness-leaf-mind",
      "wellness-sun-rays",
      "wellness-moon-calm",
      "wellness-hands-care",
      "wellness-infinity",
      "wellness-smile",
      "wellness-dove",
      "wellness-wave",
      "wellness-mountain",
      "wellness-balance",
      "wellness-spark",
      "sun-burst",
    ),
    tags: ["wellness", "love-script", "craft"],
  }),
  pack({
    slug: "craft-shapes-extras-pack",
    title: "Shapes & Extras Pack",
    description:
      "24 everyday cut shapes — circles, frames, arrows, and extras for scrapbook and vinyl.",
    category: "Shapes",
    priceCents: 450,
    compareAtCents: 1199,
    files: files(
      "shape-ornament-medallion-a",
      "shape-ornament-medallion-b",
      "animal-ears",
      "shape-raster-cut-01",
      "shape-raster-cut-06",
      "shape-raster-cut-09",
      "fabrica-monogram",
      "shape-raster-from-png",
      "shape-vector-mark",
      "shape-circle",
      "shape-square",
      "shape-triangle",
      "shape-hexagon",
      "shape-diamond",
      "shape-oval",
      "shape-arch",
      "shape-cross",
      "shape-plus-rounded",
      "shape-arrow-up",
      "shape-cloud",
      "shape-teardrop",
      "shape-burst-8",
      "shape-frame-rect",
      "shape-scallop",
    ),
    tags: ["shapes", "misc", "craft"],
  }),
  pack({
    slug: "craft-stamp-seals-pack",
    title: "Stamp & Seal Pack",
    description:
      "20 stamp and seal SVGs — round seals, company stamps, notary-style marks, and address stamps.",
    category: "Stamps",
    priceCents: 450,
    compareAtCents: 1299,
    previewPath: "/shop/files/craft/ex-libris.svg",
    files: files(
      "aequitas-ltd",
      "ava-morgan-reed",
      "editstamp",
      "editstamp-address",
      "editstamp-studio",
      "engineering-design-drafting-services",
      "est-2019",
      "ex-libris",
      "explore-and-grow",
      "harbor-desk-services",
      "harbor-food-export",
      "northbridge-design-build",
      "online-stamp-maker-seal-editor",
      "panama",
      "riverbend-medical",
      "save",
      "shelter-associates-ltd",
      "stamp",
      "www-5svg-com",
      "your-company-name",
    ),
    tags: ["stamp", "seal", "notary", "craft"],
  }),
];

function uniqueShopFiles(lists: ShopFile[][]): ShopFile[] {
  const seen = new Set<string>();
  const out: ShopFile[] = [];
  for (const list of lists) {
    for (const file of list) {
      if (seen.has(file.path)) continue;
      seen.add(file.path);
      out.push(file);
    }
  }
  return out;
}

const wholeShopFiles = uniqueShopFiles(
  INDIVIDUAL_CRAFT_PACKS.map((p) => p.files ?? []),
);

const wholeShopCompareCents = INDIVIDUAL_CRAFT_PACKS.reduce(
  (sum, p) => sum + p.priceCents,
  0,
);

/** Shop list promo art (`static/banner-logo.png`). Detail page uses og-image separately. */
const WHOLE_SHOP_COVER = "/banner-logo.png";

const WHOLE_SHOP_BUNDLE = pack({
  slug: "craft-whole-shop-bundle",
  title: "All Packs",
  description:
    "Every theme pack in one ZIP — pay once and download the full craft collection.",
  category: "All Packs",
  offer: "whole-shop",
  priceCents: 990,
  compareAtCents: wholeShopCompareCents,
  coverImage: WHOLE_SHOP_COVER,
  previewPath: WHOLE_SHOP_COVER,
  files: wholeShopFiles,
  tags: ["whole-shop", "bundle", "all-packs", "craft"],
});

export const CRAFT_PRODUCTS: ShopProduct[] = [
  WHOLE_SHOP_BUNDLE,
  ...INDIVIDUAL_CRAFT_PACKS,
];
