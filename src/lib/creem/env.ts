/**
 * Creem env — EditStamp-style.
 * Server uses CREEM_PRICE_ID_* only. CREEM_SERVER_IDX: 0=live, 1=test.
 */

import { env } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";

export type CreemPlanKey = "single" | "whole";

const CREEM_PRODUCT_ENV: Record<
  CreemPlanKey,
  { server: string; publicKit: string; nextPublic: string }
> = {
  single: {
    server: "CREEM_PRICE_ID_SINGLE",
    publicKit: "PUBLIC_CREEM_PRICE_ID_SINGLE",
    nextPublic: "NEXT_PUBLIC_CREEM_PRICE_ID_SINGLE",
  },
  whole: {
    server: "CREEM_PRICE_ID_WHOLE",
    publicKit: "PUBLIC_CREEM_PRICE_ID_WHOLE",
    nextPublic: "NEXT_PUBLIC_CREEM_PRICE_ID_WHOLE",
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

export function isCreemConfigured(): boolean {
  return getCreemApiKey().length > 0;
}

export function isCreemReadyForCheckout(): boolean {
  return (
    isCreemConfigured() &&
    (isCreemProductConfigured("single") || isCreemProductConfigured("whole"))
  );
}

export { CREEM_PRODUCT_ENV };
