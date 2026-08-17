import { error } from "@sveltejs/kit";
import type { Load } from "@sveltejs/kit";
import { isShopEnabled } from "@/lib/shop";

/** Legacy `/shop/download` — redirects to the product page after sync when shop is on. */
export const load: Load = () => {
  if (!isShopEnabled()) {
    throw error(404, "Not found");
  }
  return {};
};
