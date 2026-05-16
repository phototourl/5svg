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
  import { siteSeo } from "@/config/seo";

  let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
  <title>{siteSeo.title}</title>
  <meta name="description" content={siteSeo.description} />
  <meta name="author" content={siteSeo.siteName} />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href={siteSeo.url} />

  <link rel="icon" type="image/png" href={siteSeo.favicon} sizes="96x96" />
  <link rel="shortcut icon" href={siteSeo.favicon} />
  <link rel="apple-touch-icon" href={siteSeo.appleTouchIcon} />
  <link rel="manifest" href="/manifest.json" />

  <meta property="og:type" content={siteSeo.ogType} />
  <meta property="og:title" content={siteSeo.title} />
  <meta property="og:description" content={siteSeo.description} />
  <meta property="og:url" content={siteSeo.url} />
  <meta property="og:site_name" content={siteSeo.siteName} />
  <meta property="og:image" content={siteSeo.ogImage} />
  <meta property="og:image:width" content={String(siteSeo.ogImageWidth)} />
  <meta property="og:image:height" content={String(siteSeo.ogImageHeight)} />
  <meta property="og:image:alt" content={siteSeo.ogImageAlt} />

  <meta name="twitter:card" content={siteSeo.twitterCard} />
  <meta name="twitter:title" content={siteSeo.title} />
  <meta name="twitter:description" content={siteSeo.description} />
  <meta name="twitter:image" content={siteSeo.ogImage} />
  <meta name="twitter:image:alt" content={siteSeo.ogImageAlt} />

  <link rel="preload" href="/fonts/Geist.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  <link
    rel="preload"
    href="/fonts/GeistMono.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />

  {#if data.gaInlineScript}
    {@html `<script>${data.gaInlineScript}</script>`}
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
