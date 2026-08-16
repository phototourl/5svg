/** Browser-side shop checkout helpers (no Node imports). */

export type ShopReturnQuery = {
  orderToken: string;
  checkoutId: string;
  isCheckoutReturn: boolean;
};

export function parseShopReturnQuery(
  searchParams: URLSearchParams,
): ShopReturnQuery {
  const orderToken = searchParams.get("order_token")?.trim() || "";
  const checkoutId =
    searchParams.get("checkout_id")?.trim() ||
    searchParams.get("checkoutId")?.trim() ||
    "";
  const isCheckoutReturn =
    searchParams.get("checkout") === "success" || !!checkoutId;
  return { orderToken, checkoutId, isCheckoutReturn };
}

export type SyncShopOrderResult = {
  ok: boolean;
  error?: string;
  emailSent?: boolean;
  order?: { productSlug?: string; status?: string };
};

export async function syncShopOrder(input: {
  orderToken: string;
  locale: string;
  creemCheckoutId?: string;
}): Promise<SyncShopOrderResult> {
  const res = await fetch("/api/shop/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderToken: input.orderToken,
      locale: input.locale,
      creemCheckoutId: input.creemCheckoutId || undefined,
    }),
  });
  const json = (await res.json()) as SyncShopOrderResult & { error?: string };
  if (!res.ok) {
    return { ok: false, error: json.error || "Sync failed" };
  }
  return {
    ok: true,
    emailSent: json.emailSent,
    order: json.order,
  };
}

export async function downloadZipBlob(
  token: string,
  fallbackFilename: string,
  fallbackError: string,
): Promise<void> {
  const res = await fetch(
    `/api/shop/download?order_token=${encodeURIComponent(token)}`,
  );
  if (!res.ok) {
    let msg = fallbackError;
    try {
      const j = (await res.json()) as { error?: string };
      if (j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition") || "";
  const match = /filename="?([^";]+)"?/i.exec(cd);
  const filename = match?.[1] || fallbackFilename;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildProductReturnUrl(
  productPath: string,
  orderToken: string,
  opts: { isCheckoutReturn?: boolean; checkoutId?: string },
): string {
  const q = new URLSearchParams({ order_token: orderToken });
  if (opts.isCheckoutReturn) q.set("checkout", "success");
  if (opts.checkoutId) q.set("checkout_id", opts.checkoutId);
  return `${productPath}?${q.toString()}`;
}
