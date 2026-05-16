/**
 * Site-wide configuration (aligned with phototourl `websiteConfig` pattern).
 *
 * Google Analytics ID is NOT stored here — set at build time via:
 * - Dokploy Build-time Arguments: NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-V4P03XBERL
 * - Injected in root layout `<head>` like phototourl (see `src/lib/ga-inline-script.ts`)
 * - Local dev: copy `.env.example` → `.env`
 */
export const websiteConfig = {
  analytics: {
    enableGoogleAnalytics: true,
  },
} as const;

export function getGoogleAnalyticsId(
  publicEnvId: string | undefined,
): string | null {
  if (!websiteConfig.analytics.enableGoogleAnalytics) {
    return null;
  }

  const id = publicEnvId?.trim();
  return id || null;
}
