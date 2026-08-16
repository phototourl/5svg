import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { createShopCheckout } from "@/lib/shop/server";
import { localizePath } from "@/lib/i18n/paths";
import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config";

export const POST: RequestHandler = async ({ request }) => {
  let body: { productSlug?: string; email?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    throw error(400, "Invalid JSON");
  }

  const productSlug = body.productSlug?.trim();
  const email = body.email?.trim();
  if (!productSlug || !email) {
    throw error(400, "productSlug and email are required");
  }

  const locale = (body.locale || DEFAULT_LOCALE) as AppLocale;
  /** EditStamp-style: return to the product page, sync there, auto-download ZIP. */
  const successPath = localizePath(`/shop/${productSlug}`, locale);

  const result = await createShopCheckout({
    productSlug,
    email,
    successPath,
    localePathPrefix:
      locale === DEFAULT_LOCALE ? "" : `/${locale}`,
  });

  if (!result.ok) {
    return json({ error: result.error }, { status: 400 });
  }

  return json({
    checkoutUrl: result.checkoutUrl,
    orderToken: result.orderToken,
    mock: result.mock,
  });
};
