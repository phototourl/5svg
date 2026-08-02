<script lang="ts">
  import type { LayoutProps } from "./$types";

  import "@/styles/globals.css";

  import { ModeWatcher } from "mode-watcher";
  import Sonner from "@/components/ui/sonner/sonner.svelte";
  import GoogleAnalytics from "@/components/layout/GoogleAnalytics.svelte";
  import SiteHead from "@/components/seo/site-head.svelte";

  let { data, children }: LayoutProps = $props();

  const scriptClose = "</" + "script>";
  const gaScriptHtml = $derived(
    data.gaInlineScript ? "<script>" + data.gaInlineScript + scriptClose : "",
  );
</script>

<SiteHead />

<svelte:head>
  <link rel="preload" href="/fonts/Geist.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link
    rel="preload"
    href="/fonts/GeistMono.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />

  {#if gaScriptHtml}
    {@html gaScriptHtml}
  {/if}
</svelte:head>

<ModeWatcher />
<GoogleAnalytics />
<Sonner />
{@render children?.()}
