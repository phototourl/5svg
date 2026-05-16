/**
 * Site-wide configuration (aligned with phototourl `websiteConfig` pattern).
 * Env `PUBLIC_GOOGLE_ANALYTICS_ID` overrides `analytics.googleAnalyticsId` when set.
 */
export const websiteConfig = {
  analytics: {
    enableGoogleAnalytics: true,
    /** Default GA4 measurement ID for 5svg.com */
    googleAnalyticsId: "G-V4P03XBERL",
  },
} as const;

export function getGoogleAnalyticsId(
  publicEnvId: string | undefined,
): string | null {
  if (!websiteConfig.analytics.enableGoogleAnalytics) {
    return null;
  }

  const fromEnv = publicEnvId?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  return websiteConfig.analytics.googleAnalyticsId || null;
}
