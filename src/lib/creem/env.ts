/**
 * Creem env — aligned with EditStamp naming.
 *
 * Server checkout prefers `CREEM_PRICE_ID_*` (runtime).
 * Public fallback: `PUBLIC_CREEM_PRICE_ID_*` (SvelteKit) or `NEXT_PUBLIC_CREEM_PRICE_ID_*` (same name as EditStamp).
 *
 * Test vs Live: same variable names; switch values + CREEM_SERVER_IDX (0=正式, 1=测试).
 * Do not use PRO_MONTHLY — 5SVG currently has one one-time Bundle download product only.
 */

import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

/** One-time craft Bundle ZIP download (EditStamp `single` 同级). */
export type CreemPlanKey = "single";

const CREEM_PRODUCT_ENV: Record<
  CreemPlanKey,
  { server: string; publicKit: string; nextPublic: string }
> = {
  single: {
    server: "CREEM_PRICE_ID_SINGLE",
    publicKit: "PUBLIC_CREEM_PRICE_ID_SINGLE",
    nextPublic: "NEXT_PUBLIC_CREEM_PRICE_ID_SINGLE",
  },
};

function readPrivate(name: string): string {
  const fromKit = (env as Record<string, string | undefined>)[name]?.trim();
  if (fromKit) return fromKit;
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[name]?.trim() : undefined;
  return fromProcess ?? "";
}

function readPublic(name: string): string {
  const fromKit = (publicEnv as Record<string, string | undefined>)[name]?.trim();
  if (fromKit) return fromKit;
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[name]?.trim() : undefined;
  return fromProcess ?? "";
}

export function getCreemApiKey(): string {
  return readPrivate("CREEM_API_KEY");
}

export function getCreemWebhookSecret(): string {
  return readPrivate("CREEM_WEBHOOK_SECRET");
}

/** 0 = 正式 live API，1 = 测试 sandbox（与 EditStamp 一致）. */
export function getCreemServerIdx(): 0 | 1 {
  return readPrivate("CREEM_SERVER_IDX") === "1" ? 1 : 0;
}

export function isCreemSandboxMode(): boolean {
  const key = getCreemApiKey();
  return key.startsWith("creem_test_") || getCreemServerIdx() === 1;
}

export function getCreemProductId(planKey: CreemPlanKey = "single"): string {
  const keys = CREEM_PRODUCT_ENV[planKey];
  return (
    readPrivate(keys.server) ||
    readPublic(keys.publicKit) ||
    readPublic(keys.nextPublic) ||
    readPrivate(keys.nextPublic)
  );
}

export function isCreemProductConfigured(
  planKey: CreemPlanKey = "single",
): boolean {
  return getCreemProductId(planKey).length > 0;
}

/** True when API key present and mock not forced. */
export function isCreemConfigured(): boolean {
  if (readPrivate("CREEM_MOCK") === "1" || readPrivate("CREEM_MOCK") === "true") {
    return false;
  }
  return getCreemApiKey().length > 0;
}

export function isCreemReadyForCheckout(): boolean {
  return isCreemConfigured() && isCreemProductConfigured("single");
}

export { CREEM_PRODUCT_ENV };
