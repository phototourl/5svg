import type { Load } from "@sveltejs/kit";
import {
  getLiveThemeProducts,
  getShopFilterCategories,
  getWholeShopProduct,
} from "@/lib/shop";

export const load: Load = ({ url }) => {
  const category = url.searchParams.get("category") || "";
  const themes = getLiveThemeProducts();
  const categories = getShopFilterCategories();
  const products =
    category &&
    categories.some((c) => c.toLowerCase() === category.toLowerCase())
      ? themes.filter((p) => p.category.toLowerCase() === category.toLowerCase())
      : themes;

  return {
    products,
    categories,
    activeCategory: category || null,
    wholeShop: getWholeShopProduct() ?? null,
  };
};
