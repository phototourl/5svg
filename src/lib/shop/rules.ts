/**
 * 5SVG resource rules — public nav storefront (8svg-style).
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
    /** Product page handles Creem return (sync + auto ZIP). Legacy `/shop/download` redirects there. */
    successPath: "/shop/[slug]",
    /** false = 有 CREEM_API_KEY + PRICE_ID 即走真实结账；缺省仍 mock */
    mockUntilCreemWired: false,
  },
} as const;
