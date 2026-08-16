import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { RowDataPacket } from "mysql2";
import type { ShopOrder, ShopOrderStatus } from "@/lib/shop/types";
import { getProductBySlug } from "@/lib/shop/catalog";
import { exec, isDbConfigured, queryRows } from "./pool";

const DOWNLOAD_TTL_DAYS = 30;
/** Cap ZIP fetches per paid order (token can be shared). */
const MAX_DOWNLOADS_PER_ORDER = 10;

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "shop-orders.json");
const fileOrders = new Map<string, ShopOrder>();
let fileLoaded = false;

type OrderRow = RowDataPacket & {
  id: string;
  order_token: string;
  product_slug: string;
  creem_product_id: string | null;
  guest_email: string;
  user_id: string | null;
  amount_cents: number;
  currency: string;
  status: ShopOrderStatus;
  paid: number;
  creem_checkout_id: string | null;
  creem_order_id: string | null;
  creem_customer_id: string | null;
  download_count: number;
  email_sent: number;
  paid_at: Date | string | null;
  expires_at: Date | string | null;
  created_at: Date | string;
};

function newToken(): string {
  return randomBytes(16).toString("hex");
}

function toMs(v: Date | string | null | undefined): number | undefined {
  if (!v) return undefined;
  const t = v instanceof Date ? v.getTime() : new Date(v).getTime();
  return Number.isFinite(t) ? t : undefined;
}

function rowToOrder(row: OrderRow): ShopOrder {
  return {
    id: row.id,
    token: row.order_token,
    productSlug: row.product_slug,
    email: row.guest_email,
    amountCents: row.amount_cents,
    status: row.status,
    createdAt: toMs(row.created_at) ?? Date.now(),
    paidAt: toMs(row.paid_at),
    creemCheckoutId: row.creem_checkout_id ?? undefined,
    creemOrderId: row.creem_order_id ?? undefined,
    creemCustomerId: row.creem_customer_id ?? undefined,
    creemProductId: row.creem_product_id ?? undefined,
    downloadCount: row.download_count,
    emailSent: !!row.email_sent,
    expiresAt: toMs(row.expires_at),
  };
}

function ensureFileLoaded() {
  if (fileLoaded) return;
  fileLoaded = true;
  try {
    if (!existsSync(DATA_FILE)) return;
    const list = JSON.parse(readFileSync(DATA_FILE, "utf8")) as ShopOrder[];
    for (const o of list) if (o?.token) fileOrders.set(o.token, o);
  } catch {
    /* ignore */
  }
}

function persistFile() {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify([...fileOrders.values()], null, 2));
  } catch {
    /* ignore */
  }
}

export async function createPendingOrder(input: {
  productSlug: string;
  email: string;
}): Promise<ShopOrder | null> {
  const product = getProductBySlug(input.productSlug);
  if (!product || product.status !== "live") return null;

  const email = input.email.trim().toLowerCase();
  const id = randomUUID();
  const token = newToken();
  const createdAt = Date.now();

  if (isDbConfigured()) {
    await exec(
      `INSERT INTO shop_order (
        id, order_token, product_slug, creem_product_id, guest_email,
        amount_cents, currency, status, paid, email_sent, download_count
      ) VALUES (?, ?, ?, ?, ?, ?, 'USD', 'pending', 0, 0, 0)`,
      [
        id,
        token,
        product.slug,
        product.creemProductId ?? null,
        email,
        product.priceCents,
      ],
    );
    return {
      id,
      token,
      productSlug: product.slug,
      email,
      amountCents: product.priceCents,
      status: "pending",
      createdAt,
      emailSent: false,
      downloadCount: 0,
    };
  }

  ensureFileLoaded();
  const order: ShopOrder = {
    id,
    token,
    productSlug: product.slug,
    email,
    amountCents: product.priceCents,
    status: "pending",
    createdAt,
    emailSent: false,
    downloadCount: 0,
  };
  fileOrders.set(token, order);
  persistFile();
  return order;
}

export async function getOrderByToken(
  token: string,
): Promise<ShopOrder | undefined> {
  if (isDbConfigured()) {
    const rows = await queryRows<OrderRow>(
      `SELECT * FROM shop_order WHERE order_token = ? LIMIT 1`,
      [token],
    );
    return rows[0] ? rowToOrder(rows[0]) : undefined;
  }
  ensureFileLoaded();
  return fileOrders.get(token);
}

export async function setOrderStatus(
  token: string,
  status: ShopOrderStatus,
  extra?: Partial<
    Pick<
      ShopOrder,
      | "creemCheckoutId"
      | "creemOrderId"
      | "creemCustomerId"
      | "paidAt"
      | "expiresAt"
    >
  >,
): Promise<ShopOrder | undefined> {
  if (isDbConfigured()) {
    const paid = status === "paid" ? 1 : 0;
    const paidAt =
      status === "paid"
        ? new Date(extra?.paidAt ?? Date.now())
        : null;
    const expiresAt =
      status === "paid"
        ? new Date(
            extra?.expiresAt ??
              Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000,
          )
        : null;

    await exec(
      `UPDATE shop_order SET
        status = ?,
        paid = ?,
        paid_at = COALESCE(?, paid_at),
        expires_at = COALESCE(?, expires_at),
        creem_checkout_id = COALESCE(?, creem_checkout_id),
        creem_order_id = COALESCE(?, creem_order_id),
        creem_customer_id = COALESCE(?, creem_customer_id)
      WHERE order_token = ?`,
      [
        status,
        paid,
        paidAt,
        expiresAt,
        extra?.creemCheckoutId ?? null,
        extra?.creemOrderId ?? null,
        extra?.creemCustomerId ?? null,
        token,
      ],
    );
    return getOrderByToken(token);
  }

  ensureFileLoaded();
  const order = fileOrders.get(token);
  if (!order) return undefined;
  order.status = status;
  if (status === "paid") {
    order.paidAt = extra?.paidAt ?? Date.now();
    order.expiresAt =
      extra?.expiresAt ??
      Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000;
  }
  if (extra?.creemCheckoutId) order.creemCheckoutId = extra.creemCheckoutId;
  if (extra?.creemOrderId) order.creemOrderId = extra.creemOrderId;
  if (extra?.creemCustomerId) order.creemCustomerId = extra.creemCustomerId;
  fileOrders.set(token, order);
  persistFile();
  return order;
}

export async function markOrderPaid(
  token: string,
  creemCheckoutId?: string,
  extra?: Partial<Pick<ShopOrder, "creemOrderId" | "creemCustomerId">>,
): Promise<ShopOrder | undefined> {
  return setOrderStatus(token, "paid", {
    creemCheckoutId,
    creemOrderId: extra?.creemOrderId,
    creemCustomerId: extra?.creemCustomerId,
  });
}

/** Atomically claim email send (email_sent 0 → 1). Returns false if already sent. */
export async function claimOrderEmailSend(token: string): Promise<boolean> {
  if (isDbConfigured()) {
    const result = await exec(
      `UPDATE shop_order SET email_sent = 1
       WHERE order_token = ? AND email_sent = 0 AND paid = 1`,
      [token],
    );
    return result.affectedRows > 0;
  }
  ensureFileLoaded();
  const order = fileOrders.get(token);
  if (!order || order.status !== "paid" || order.emailSent) return false;
  order.emailSent = true;
  fileOrders.set(token, order);
  persistFile();
  return true;
}

export async function releaseOrderEmailClaim(token: string): Promise<void> {
  if (isDbConfigured()) {
    await exec(`UPDATE shop_order SET email_sent = 0 WHERE order_token = ?`, [
      token,
    ]);
    return;
  }
  ensureFileLoaded();
  const order = fileOrders.get(token);
  if (!order) return;
  order.emailSent = false;
  fileOrders.set(token, order);
  persistFile();
}

export async function bumpDownloadCount(token: string): Promise<void> {
  if (isDbConfigured()) {
    await exec(
      `UPDATE shop_order SET download_count = download_count + 1 WHERE order_token = ? AND paid = 1`,
      [token],
    );
    return;
  }
  ensureFileLoaded();
  const order = fileOrders.get(token);
  if (!order || order.status !== "paid") return;
  order.downloadCount = (order.downloadCount ?? 0) + 1;
  fileOrders.set(token, order);
  persistFile();
}

export function isOrderDownloadExpired(order: ShopOrder): boolean {
  if (!order.expiresAt) return false;
  return Date.now() > order.expiresAt;
}

export function isOrderDownloadLimitReached(order: ShopOrder): boolean {
  return (order.downloadCount ?? 0) >= MAX_DOWNLOADS_PER_ORDER;
}

export { DOWNLOAD_TTL_DAYS, MAX_DOWNLOADS_PER_ORDER };
