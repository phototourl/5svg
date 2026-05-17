<script lang="ts">
  import type { LayoutProps } from "./$types";

  // Styles:
  import "@/styles/globals.css";

  // Layout:
  import Header from "@/components/layout/header.svelte";
  import MarketingAnnouncement from "@/components/marketing/marketingAnnouncement.svelte";
  import MarketingHeader from "@/components/marketing/marketingHeader.svelte";
  import MarketingFooter from "@/components/marketing/marketingFooter.svelte";
  import { page } from "$app/state";

  // Providers:
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
{#if page.url.pathname === "/"}
  <div class="min-h-screen bg-white dark:bg-neutral-950">
    <MarketingAnnouncement />
    <MarketingHeader />
    <main>{@render children?.()}</main>
    <MarketingFooter />
  </div>
{:else}
  <Header />
  {@render children?.()}
{/if}
