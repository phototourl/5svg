/**
 * Creem API proxy — EditStamp CreemProvider.createCheckout 同形。
 */

import { Creem } from "creem";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getCreemApiKey,
  getCreemServerIdx,
  getCreemWebhookSecret,
  isCreemConfigured,
} from "./env";

export type CreemCreateCheckoutInput = {
  productId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl?: string;
  metadata: Record<string, string>;
};

export type CreemCreateCheckoutResult = {
  checkoutId: string;
  checkoutUrl: string;
};

export type CreemWebhookVerifyResult = {
  ok: true;
  eventType: string;
  data: Record<string, unknown>;
  raw: string;
};

function getClient(): Creem {
  const apiKey = getCreemApiKey();
  if (!apiKey) {
    throw new Error("CREEM_API_KEY is not set");
  }
  return new Creem({ apiKey, serverIdx: getCreemServerIdx() });
}

export async function createCreemCheckout(
  input: CreemCreateCheckoutInput,
): Promise<CreemCreateCheckoutResult> {
  if (!isCreemConfigured()) {
    throw new Error("Creem is not configured (CREEM_API_KEY empty or CREEM_MOCK=1)");
  }

  const creem = getClient();
  const checkout = await creem.checkouts.create({
    productId: input.productId,
    customer: { email: input.customerEmail },
    successUrl: input.successUrl,
    ...(input.cancelUrl ? { cancelUrl: input.cancelUrl } : {}),
    metadata: input.metadata,
  } as Parameters<Creem["checkouts"]["create"]>[0]);

  const checkoutUrl = checkout.checkoutUrl ?? "";
  const checkoutId = checkout.id ?? "";
  if (!checkoutUrl || !checkoutId) {
    throw new Error("Creem checkout response missing url/id");
  }

  return { checkoutId, checkoutUrl };
}

export type CreemRetrievedCheckout = {
  id: string;
  status: string;
  orderId?: string;
  customerId?: string;
  productId?: string;
  metadata: Record<string, string>;
};

/**
 * Retrieve checkout session (used after success redirect to confirm payment).
 */
export async function retrieveCreemCheckout(
  checkoutId: string,
): Promise<CreemRetrievedCheckout> {
  if (!isCreemConfigured()) {
    throw new Error("Creem is not configured (CREEM_API_KEY empty or CREEM_MOCK=1)");
  }
  const id = checkoutId.trim();
  if (!id) throw new Error("checkoutId required");

  const creem = getClient();
  const checkout = await creem.checkouts.retrieve(id);

  const metadataRaw = (checkout as { metadata?: Record<string, unknown> })
    .metadata;
  const metadata: Record<string, string> = {};
  if (metadataRaw && typeof metadataRaw === "object") {
    for (const [k, v] of Object.entries(metadataRaw)) {
      if (v != null) metadata[k] = String(v);
    }
  }

  const product = (checkout as { product?: { id?: string } | string }).product;
  const productId =
    typeof product === "string"
      ? product
      : product && typeof product === "object"
        ? product.id
        : undefined;

  const order = (checkout as { order?: { id?: string } | string }).order;
  const orderId =
    typeof order === "string"
      ? order
      : order && typeof order === "object"
        ? order.id
        : undefined;

  const customer = (checkout as { customer?: { id?: string } | string })
    .customer;
  const customerId =
    typeof customer === "string"
      ? customer
      : customer && typeof customer === "object"
        ? customer.id
        : undefined;

  return {
    id: checkout.id ?? id,
    status: String(checkout.status ?? ""),
    orderId,
    customerId,
    productId,
    metadata,
  };
}

/** Parse Creem webhook JSON shape (`eventType` + `object` preferred). */
export function parseCreemWebhookBody(payload: string): {
  eventType: string;
  data: Record<string, unknown>;
} {
  const parsed = JSON.parse(payload) as {
    type?: string;
    eventType?: string;
    data?: Record<string, unknown>;
    object?: Record<string, unknown>;
  };

  const eventType = String(parsed.eventType ?? parsed.type ?? "");
  const data =
    (parsed.object && typeof parsed.object === "object"
      ? parsed.object
      : null) ??
    (parsed.data && typeof parsed.data === "object" ? parsed.data : null) ??
    (parsed as Record<string, unknown>);

  return { eventType, data };
}

/**
 * Verify webhook signature (HMAC-SHA256, EditStamp-compatible).
 * Creem live payloads: `{ eventType, object, id?, ... }` (not Stripe-style `data`).
 */
export function verifyCreemWebhook(
  payload: string,
  signature: string,
): CreemWebhookVerifyResult {
  const secret = getCreemWebhookSecret();
  if (!secret) {
    throw new Error("CREEM_WEBHOOK_SECRET is not set");
  }
  if (!signature) {
    throw new Error("Missing Creem webhook signature");
  }

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error("Invalid Creem webhook signature");
  }

  const { eventType, data } = parseCreemWebhookBody(payload);

  return {
    ok: true,
    eventType,
    data,
    raw: payload,
  };
}

export { isCreemConfigured };
