/** Sellable pack (library category ZIP or craft multi-file ZIP). */
export type ShopProductStatus = "draft" | "live";
export type ShopProductKind = "library" | "craft";

export type ShopFile = {
  path: string;
  filename: string;
};

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Filter label: library category or craft theme. */
  category: string;
  kind: ShopProductKind;
  /** whole-shop = all-packs offer (not a theme filter). */
  offer?: "whole-shop";
  /** Optional marketing cover (preferred over first craft file for cards/hero). */
  coverImage?: string;
  priceCents: number;
  compareAtCents?: number;
  fileCount: number;
  previewPath: string;
  license: "personal" | "commercial";
  status: ShopProductStatus;
  creemProductId?: string;
  tags: string[];
  /** Craft packs only — explicit file list under /shop/files/craft. */
  files?: ShopFile[];
};

export type ShopOrderStatus = "pending" | "paid" | "failed" | "refunded";

export type ShopOrder = {
  id: string;
  token: string;
  productSlug: string;
  email: string;
  amountCents: number;
  status: ShopOrderStatus;
  createdAt: number;
  paidAt?: number;
  expiresAt?: number;
  creemCheckoutId?: string;
  creemOrderId?: string;
  creemCustomerId?: string;
  creemProductId?: string;
  downloadCount?: number;
  emailSent?: boolean;
};
