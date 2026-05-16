<script lang="ts">
  import { onMount } from "svelte";
  import { afterNavigate } from "$app/navigation";
  import { browser } from "$app/environment";
  import { readGoogleAnalyticsEnvId } from "@/config/analytics-env";
  import { getGoogleAnalyticsId } from "@/config/website";

  /** Same env name as phototourl; optional in local dev */
  const gaId = $derived(getGoogleAnalyticsId(readGoogleAnalyticsEnvId()));

  function loadGoogleAnalytics(id: string) {
    if (!browser || !id) return;

    const w = window as Window & { __fivesvgGa?: number };
    if (w.__fivesvgGa) return;
    w.__fivesvgGa = 1;

    w.dataLayer = w.dataLayer || [];
    function gtag(...args: unknown[]) {
      w.dataLayer!.push(args);
    }
    w.gtag = gtag as typeof window.gtag;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.onload = () => {
      gtag("js", new Date());
      gtag("config", id);
    };
    document.head.appendChild(script);
  }

  function trackPageView(path: string) {
    if (!browser || !gaId || !window.gtag) return;
    window.gtag("config", gaId, { page_path: path });
  }

  onMount(() => {
    if (!gaId) return;

    const start = () => loadGoogleAnalytics(gaId);

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
  });

  afterNavigate(({ to }) => {
    trackPageView(`${to.url.pathname}${to.url.search}`);
  });
</script>
