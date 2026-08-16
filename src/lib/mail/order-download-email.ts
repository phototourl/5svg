import { brand } from "@/brand";
import {
  claimOrderEmailSend,
  releaseOrderEmailClaim,
  getOrderByToken,
  MAX_DOWNLOADS_PER_ORDER,
  DOWNLOAD_TTL_DAYS,
} from "@/lib/shop/orders";
import { getProductBySlug } from "@/lib/shop/catalog";
import { sendRawEmail } from "./resend";
import { env } from "$env/dynamic/private";
import { getMessagesForLocale } from "@/lib/i18n/messages";
import { DEFAULT_LOCALE, isLocale, type AppLocale } from "@/lib/i18n/config";
import { createTranslator } from "@/lib/i18n/translator";

/** Absolute backup download URL (link only, no ZIP attachment). Opens product page → sync → download. */
export function buildOrderDownloadUrl(
  orderToken: string,
  productSlug: string,
  localePathPrefix = "",
): string {
  const origin = (
    env.PUBLIC_SITE_URL ||
    env.ORIGIN ||
    brand.siteUrl
  ).replace(/\/$/, "");
  const prefix = localePathPrefix.replace(/\/$/, "");
  const path = `${prefix}/shop/${encodeURIComponent(productSlug)}?order_token=${encodeURIComponent(orderToken)}`;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function resolveLocale(input?: string | null): AppLocale {
  if (input && isLocale(input)) return input;
  return DEFAULT_LOCALE;
}

/**
 * Send one backup download email per paid order (atomic email_sent claim).
 * Content + link only — never attach the ZIP (EditStamp pattern).
 * Skips automatically when RESEND_API_KEY is missing (see sendRawEmail).
 */
export async function trySendOrderDownloadEmailOnce(input: {
  orderToken: string;
  localePathPrefix?: string;
  locale?: string | null;
}): Promise<boolean> {
  const claimed = await claimOrderEmailSend(input.orderToken);
  if (!claimed) return false;

  const order = await getOrderByToken(input.orderToken);
  if (!order || order.status !== "paid") {
    await releaseOrderEmailClaim(input.orderToken);
    return false;
  }

  const product = getProductBySlug(order.productSlug);
  const locale = resolveLocale(input.locale);
  const messages = await getMessagesForLocale(locale);
  const t = createTranslator(messages);
  const title =
    product?.offer === "whole-shop"
      ? t("shop.wholeShopTitle")
      : (product?.title ?? order.productSlug);
  const url = buildOrderDownloadUrl(
    order.token,
    order.productSlug,
    input.localePathPrefix ??
      (locale === DEFAULT_LOCALE ? "" : `/${locale}`),
  );

  const subject = t("Mail.orderDownloadLink.subject", { title });
  const heading = t("Mail.orderDownloadLink.title");
  const body = t("Mail.orderDownloadLink.body", { title });
  const button = t("Mail.orderDownloadLink.downloadButton");
  const linkFallback = t("Mail.orderDownloadLink.linkFallback");
  const note = t("Mail.orderDownloadLink.note");
  const limitNote = t("Mail.orderDownloadLink.limitNote", {
    maxDownloads: MAX_DOWNLOADS_PER_ORDER,
    days: DOWNLOAD_TTL_DAYS,
  });
  const textIntro = t("Mail.orderDownloadLink.textIntro", { title });
  const textDownload = t("Mail.orderDownloadLink.textDownload");
  const textSupport = t("Mail.orderDownloadLink.textSupport", {
    email: brand.supportEmail,
  });

  const text = [
    textIntro,
    "",
    textDownload,
    url,
    "",
    note,
    limitNote,
    "",
    textSupport,
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.5;color:#111">
      <h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 16px">${escapeHtml(body)}</p>
      <p style="margin:0 0 20px">
        <a href="${escapeAttr(url)}"
           style="display:inline-block;background:#15803D;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600">
          ${escapeHtml(button)}
        </a>
      </p>
      <p style="margin:0 0 8px;font-size:13px;color:#555">${escapeHtml(linkFallback)}</p>
      <p style="margin:0 0 20px;font-size:13px;word-break:break-all">
        <a href="${escapeAttr(url)}">${escapeHtml(url)}</a>
      </p>
      <p style="margin:0 0 8px;font-size:12px;color:#777">${escapeHtml(note)}</p>
      <p style="margin:0;font-size:12px;color:#777">${escapeHtml(limitNote)}</p>
    </div>
  `;

  try {
    const ok = await sendRawEmail({
      to: order.email,
      subject,
      html,
      text,
    });
    if (!ok) {
      await releaseOrderEmailClaim(input.orderToken);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mail] order download email failed", e);
    await releaseOrderEmailClaim(input.orderToken);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;");
}
