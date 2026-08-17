import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { syncShopCheckout, getOrderByToken } from "@/lib/shop/server";
import { getProductBySlug, isShopEnabled } from "@/lib/shop";
import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config";

export const POST: RequestHandler = async ({ request }) => {
  if (!isShopEnabled()) {
    throw error(503, "Shop is temporarily unavailable");
  }

  let body: {
    orderToken?: string;
    locale?: string;
    creemCheckoutId?: string;
  };
  try {
    body = await request.json();
  } catch {
    throw error(400, "Invalid JSON");
  }

  const orderToken = body.orderToken?.trim();
  if (!orderToken) throw error(400, "orderToken required");

  const locale = (body.locale || DEFAULT_LOCALE) as AppLocale;
  const localePathPrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  const result = await syncShopCheckout(orderToken, {
    localePathPrefix,
    creemCheckoutId: body.creemCheckoutId,
    locale,
  });

  if (!result.ok) {
    return json({ error: result.error }, { status: 402 });
  }

  const order = await getOrderByToken(orderToken);
  const product = order ? getProductBySlug(order.productSlug) : undefined;

  return json({
    status: result.status,
    emailSent: result.emailSent ?? false,
    order: order
      ? {
          token: order.token,
          email: order.email,
          productSlug: order.productSlug,
          productTitle: product?.title,
          amountCents: order.amountCents,
          expiresAt: order.expiresAt ?? null,
        }
      : null,
  });
};
