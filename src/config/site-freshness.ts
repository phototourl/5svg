/** Sitewide content freshness (update when library or SEO pages change materially). */
export const siteLastUpdated = "2026-05-17" as const;

export function formatSiteLastUpdated(locale = "en-US"): string {
  const date = new Date(`${siteLastUpdated}T00:00:00`);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
