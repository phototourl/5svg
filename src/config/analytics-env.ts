/**
 * GA ID from build-time env (same name as phototourl).
 * `NEXT_PUBLIC_*` is exposed via `vite.config.ts` envPrefix.
 */
export function readGoogleAnalyticsEnvId(): string | undefined {
  const id =
    import.meta.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ||
    import.meta.env.PUBLIC_GOOGLE_ANALYTICS_ID;
  return id?.trim() || undefined;
}
