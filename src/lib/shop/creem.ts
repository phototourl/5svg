import { SHOP_RULES } from "./rules";
import {
  createPendingOrder,
  getOrderByToken,
  markOrderPaid,
  setOrderStatus,
} from "./orders";
import { getProductBySlug } from "./catalog";
import { env } from "$env/dynamic/private";
import {
  createCreemCheckout,
  getCreemProductId,
  isCreemReadyForCheckout,
  retrieveCreemCheckout,
} from "@/lib/creem";
import { trySendOrderDownloadEmailOnce } from "@/lib/mail/order-download-email";

export type CreateShopCheckoutInput = {
  productSlug: string;
  email: string;
  /** Locale-aware return path after pay, e.g. `/shop/my-pack` or `/zh/shop/my-pack`. */
  successPath: string;
  /** Optional locale prefix for email backup link, e.g. `/zh` */
  localePathPrefix?: string;
};

export type CreateShopCheckoutResult =
  | { ok: true; checkoutUrl: string; orderToken: string; mock: boolean }
  | { ok: false; error: string };

/** True while Creem keys / product id missing or mock forced. */
export function isCreemMockMode(): boolean {
  if (SHOP_RULES.checkout.mockUntilCreemWired) return true;
  if (env.CREEM_MOCK === "1" || env.CREEM_MOCK === "true") return true;
  if (!isCreemReadyForCheckout()) return true;
  return false;
}

/**
 * Create checkout — mock until Creem is configured.
 * After pay: return to product page → sync marks paid, sends link-only email, auto-download ZIP.
 */
export async function createShopCheckout(
  input: CreateShopCheckoutInput,
): Promise<CreateShopCheckoutResult> {
  const product = getProductBySlug(input.productSlug);
  if (!product || product.status !== "live") {
    return { ok: false, error: "Product not found" };
  }

  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Valid email required" };
  }

  const order = await createPendingOrder({ productSlug: product.slug, email });
  if (!order) return { ok: false, error: "Could not create order" };

  const successPath = appendQuery(input.successPath, {
    checkout: "success",
    order_token: order.token,
  });

  if (isCreemMockMode()) {
    const checkoutUrl = appendQuery("/api/shop/creem/mock-pay", {
      order_token: order.token,
      success_path: successPath,
    });
    return {
      ok: true,
      checkoutUrl,
      orderToken: order.token,
      mock: true,
    };
  }

  try {
    // 一期：全站 Bundle 共用一个 Creem 单次产品（EditStamp SINGLE 同级）
    const productId =
      product.creemProductId || getCreemProductId("single") || "";
    if (!productId) {
      return { ok: false, error: "CREEM_PRICE_ID_SINGLE is not set" };
    }
    const origin = env.PUBLIC_SITE_URL || brandSite();
    const absoluteSuccess = toAbsolute(origin, successPath);
    const checkout = await createCreemCheckout({
      productId,
      customerEmail: email,
      successUrl: absoluteSuccess,
      metadata: {
        orderToken: order.token,
        productSlug: product.slug,
        scene: "single",
        planId: "single",
      },
    });
    await setOrderStatus(order.token, "pending", {
      creemCheckoutId: checkout.checkoutId,
    });
    return {
      ok: true,
      checkoutUrl: checkout.checkoutUrl,
      orderToken: order.token,
      mock: false,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Creem checkout failed";
    return { ok: false, error: msg };
  }
}

export async function syncShopCheckout(
  orderToken: string,
  opts?: {
    localePathPrefix?: string;
    creemCheckoutId?: string;
    locale?: string | null;
  },
): Promise<{
  ok: boolean;
  status?: string;
  error?: string;
  emailSent?: boolean;
}> {
  const order = await getOrderByToken(orderToken);
  if (!order) return { ok: false, error: "Order not found" };

  if (order.status === "paid") {
    const emailSent = await trySendOrderDownloadEmailOnce({
      orderToken,
      localePathPrefix: opts?.localePathPrefix,
      locale: opts?.locale,
    });
    return { ok: true, status: "paid", emailSent };
  }

  if (isCreemMockMode()) {
    await markOrderPaid(
      orderToken,
      opts?.creemCheckoutId ?? `mock_${orderToken}`,
    );
    const emailSent = await trySendOrderDownloadEmailOnce({
      orderToken,
      localePathPrefix: opts?.localePathPrefix,
      locale: opts?.locale,
    });
    return { ok: true, status: "paid", emailSent };
  }

  const checkoutId =
    opts?.creemCheckoutId?.trim() || order.creemCheckoutId?.trim() || "";
  if (!checkoutId) {
    return { ok: false, error: "Missing Creem checkout id" };
  }

  try {
    const checkout = await retrieveCreemCheckout(checkoutId);
    const status = checkout.status.toLowerCase();
    if (status !== "completed" && status !== "paid") {
      return {
        ok: false,
        error: `Payment not confirmed yet (status: ${checkout.status || "unknown"})`,
      };
    }

    // Prefer metadata on checkout; fall back to our pending order token.
    const metaToken =
      checkout.metadata.orderToken || checkout.metadata.exportToken || "";
    if (metaToken && metaToken !== orderToken) {
      return { ok: false, error: "Checkout does not match this order" };
    }

    await markOrderPaid(orderToken, checkout.id, {
      creemOrderId: checkout.orderId,
      creemCustomerId: checkout.customerId,
    });
    const emailSent = await trySendOrderDownloadEmailOnce({
      orderToken,
      localePathPrefix: opts?.localePathPrefix,
      locale: opts?.locale,
    });
    return { ok: true, status: "paid", emailSent };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Creem retrieve failed";
    return { ok: false, error: msg };
  }
}

function brandSite(): string {
  return "https://5svg.com";
}

function toAbsolute(origin: string, pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const base = origin.replace(/\/$/, "");
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function appendQuery(path: string, params: Record<string, string>): string {
  const [base, existing = ""] = path.split("?");
  const search = new URLSearchParams(existing);
  for (const [k, v] of Object.entries(params)) search.set(k, v);
  const q = search.toString();
  return q ? `${base}?${q}` : base;
}
