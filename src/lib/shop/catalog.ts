import type { ShopProduct } from "./types";
import { CRAFT_PRODUCTS } from "./craft-catalog";

/**
 * Public Bundles storefront — craft packs only (8svg-style).
 * Logo library stays free via /library (not sold as category ZIPs).
 */
export const SHOP_PRODUCTS: ShopProduct[] = [...CRAFT_PRODUCTS];

export function getLiveProducts(): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.status === "live");
}

export function isWholeShopOffer(product: ShopProduct): boolean {
  return product.offer === "whole-shop";
}

/** Theme packs only — excludes the all-packs offer. */
export function getLiveThemeProducts(): ShopProduct[] {
  return getLiveProducts().filter((p) => !isWholeShopOffer(p));
}

export function getWholeShopProduct(): ShopProduct | undefined {
  return getLiveProducts().find(isWholeShopOffer);
}

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): ShopProduct[] {
  return getLiveThemeProducts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase(),
  );
}

export function getShopFilterCategories(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of getLiveThemeProducts()) {
    const key = p.category.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p.category);
  }
  return out;
}

/** Library logos are free — no pack unlock link. */
export function getPackSlugForSvg(_svg: {
  category: string | string[];
  title: string;
}): string | null {
  return null;
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
