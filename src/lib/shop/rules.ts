/**
 * 5SVG storefront rules.
 */
export const SHOP_RULES = {
  freeLibrary: {
    note: "Logo library under Free SVG stays fully free to browse and download.",
    path: "/library",
  },

  paidBundles: {
    note: "Paid SKUs are craft SVG packs only, sold via Bundles nav → /shop.",
    path: "/shop",
    source: "src/lib/shop/craft-catalog.ts",
  },

  packing: {
    minFilesPerPack: 2,
    maxSuggestedFilesPerPack: 40,
  },

  pricing: {
    currency: "USD",
  },

  checkout: {
    /** Product page handles Creem return (sync + auto ZIP). */
    successPath: "/shop/[slug]",
  },
} as const;
