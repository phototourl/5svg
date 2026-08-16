import { error } from "@sveltejs/kit";
import type { Load } from "@sveltejs/kit";
import { getProductBySlug, isWholeShopOffer, SHOP_RULES } from "@/lib/shop";

export const load: Load = ({ params }) => {
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
    mockCheckout: SHOP_RULES.checkout.mockUntilCreemWired,
  };
};
