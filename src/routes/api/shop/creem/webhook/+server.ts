import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { verifyCreemWebhook } from "@/lib/creem";
import { markOrderPaid, getOrderByToken } from "@/lib/shop/server";
import { trySendOrderDownloadEmailOnce } from "@/lib/mail/order-download-email";
import { isDbConfigured, exec } from "@/lib/db/pool";
import { randomUUID } from "node:crypto";

/**
 * Creem webhook — mark paid + send link-only email (EditStamp pattern).
 * Requires CREEM_WEBHOOK_SECRET; verify stub throws until wired.
 */
export const POST: RequestHandler = async ({ request }) => {
  const signature =
    request.headers.get("creem-signature") ||
    request.headers.get("x-creem-signature") ||
    "";
  const payload = await request.text();

  let eventType = "";
  let data: Record<string, unknown> = {};

  try {
    if (!env.CREEM_WEBHOOK_SECRET) {
      // Dev without secret — still prefer Creem `object` shape
      const raw = JSON.parse(payload) as {
        type?: string;
        eventType?: string;
        object?: Record<string, unknown>;
        data?: Record<string, unknown>;
      };
      eventType = String(raw.eventType ?? raw.type ?? "");
      data =
        (raw.object && typeof raw.object === "object" ? raw.object : null) ??
        (raw.data && typeof raw.data === "object" ? raw.data : null) ??
        (raw as Record<string, unknown>);
    } else {
      const verified = verifyCreemWebhook(payload, signature);
      eventType = verified.eventType;
      data = verified.data;
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid webhook";
    throw error(400, msg);
  }

  if (isDbConfigured()) {
    try {
      await exec(
        `INSERT INTO creem_webhook_event
          (id, event_id, event_type, creem_checkout_id, creem_order_id, payload_json, processed)
         VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [
          randomUUID(),
          (data.id as string) ?? null,
          eventType || "unknown",
          (data.checkoutId as string) ?? null,
          (data.orderId as string) ?? null,
          payload,
        ],
      );
    } catch (e) {
      console.warn("[creem.webhook] log insert failed", e);
    }
  }

  const metadata = (data.metadata ?? {}) as Record<string, string>;
  const orderToken =
    metadata.orderToken ||
    metadata.exportToken ||
    (typeof metadata.order_token === "string" ? metadata.order_token : "");
  if (!orderToken) {
    return json({ ok: true, skipped: "no_order_token" });
  }

  // Only act on checkout completion.
  if (eventType && eventType !== "checkout.completed") {
    return json({ ok: true, skipped: "ignored_event", eventType });
  }

  const order = await getOrderByToken(orderToken);
  if (!order) {
    return json({ ok: true, skipped: "order_not_found" });
  }

  const checkoutId =
    (typeof data.id === "string" ? data.id : "") ||
    (typeof data.checkoutId === "string" ? data.checkoutId : "") ||
    "";
  const orderObj = data.order as { id?: string } | string | undefined;
  const creemOrderId =
    typeof orderObj === "string"
      ? orderObj
      : orderObj && typeof orderObj === "object"
        ? orderObj.id
        : typeof data.orderId === "string"
          ? data.orderId
          : undefined;
  const customerObj = data.customer as { id?: string } | string | undefined;
  const creemCustomerId =
    typeof customerObj === "string"
      ? customerObj
      : customerObj && typeof customerObj === "object"
        ? customerObj.id
        : typeof data.customerId === "string"
          ? data.customerId
          : undefined;

  if (order.status !== "paid") {
    await markOrderPaid(orderToken, checkoutId || undefined, {
      creemOrderId,
      creemCustomerId,
    });
  }

  await trySendOrderDownloadEmailOnce({ orderToken });

  return json({ ok: true });
};
