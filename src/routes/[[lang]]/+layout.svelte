<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { page } from "$app/state";
  import Header from "@/components/layout/header.svelte";
  import MarketingAnnouncement from "@/components/marketing/marketingAnnouncement.svelte";
  import MarketingHeader from "@/components/marketing/marketingHeader.svelte";
  import MarketingFooter from "@/components/marketing/marketingFooter.svelte";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";

  let { children }: LayoutProps = $props();

  const basePath = $derived(stripLocalePrefix(page.url.pathname, LOCALES));
  const isHome = $derived(basePath === "/");
</script>

{#if isHome}
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
