import { error } from "@sveltejs/kit";
import type { ServerLoad } from "@sveltejs/kit";
import {
  getProductBySlug,
  isShopEnabled,
  isWholeShopOffer,
} from "@/lib/shop";
import { isCreemMockMode } from "@/lib/shop/server";

export const load: ServerLoad = ({ params }) => {
  if (!isShopEnabled()) {
    throw error(404, "Not found");
  }

  const product = getProductBySlug(params.slug ?? "");
  if (!product || product.status !== "live") {
    throw error(404, "Pack not found");
  }

  const isWholeShop = isWholeShopOffer(product);
  const sampleTitles =
    product.files?.slice(0, 8).map((f) => f.filename) ?? [];

  return {
    product,
    categoryLabel: product.category,
    sampleTitles,
    isWholeShop,
    mockCheckout: isCreemMockMode(),
  };
};
