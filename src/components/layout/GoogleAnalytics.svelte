<script lang="ts">
  /**
   * SPA page views only — gtag loader is in root layout `<head>` (phototourl pattern).
   */
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { page } from "$app/state";

  const gaId = $derived(page.data.gaId);

  afterNavigate(({ to }) => {
    if (!browser || !gaId || !to || !window.gtag) return;
    window.gtag("config", gaId, {
      page_path: `${to.url.pathname}${to.url.search}`,
    });
  });
</script>
