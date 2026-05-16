import type { LayoutLoad } from "./$types";
import { readGoogleAnalyticsEnvId } from "@/config/analytics-env";
import { getGoogleAnalyticsId } from "@/config/website";
import { buildGaInlineScript } from "@/lib/ga-inline-script";

export const load: LayoutLoad = () => {
  const gaId = getGoogleAnalyticsId(readGoogleAnalyticsEnvId());

  return {
    gaId,
    gaInlineScript: gaId ? buildGaInlineScript(gaId) : null,
  };
};
