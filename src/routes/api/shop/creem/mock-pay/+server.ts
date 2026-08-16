import { redirect, error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { isCreemMockMode, markOrderPaid } from "@/lib/shop/server";

/**
 * Local mock payment — marks order paid then redirects to success URL.
 * Real Creem replaces this with hosted checkout + webhook.
 */
export const GET: RequestHandler = async ({ url }) => {
  if (!isCreemMockMode()) {
    throw error(404, "Not found");
  }

  const orderToken = url.searchParams.get("order_token")?.trim();
  const successPath = url.searchParams.get("success_path")?.trim();
  if (!orderToken || !successPath) {
    throw error(400, "order_token and success_path required");
  }

  await markOrderPaid(orderToken, `mock_${orderToken}`);

  // success_path is site-relative (may include query)
  if (!successPath.startsWith("/") || successPath.startsWith("//")) {
    throw error(400, "Invalid success_path");
  }
  throw redirect(302, successPath);
};
