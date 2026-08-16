<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { browser } from "$app/environment";
  import { cn } from "@/utils/cn";
  import MarketingAnnouncement from "@/components/marketing/marketingAnnouncement.svelte";
  import MarketingHeader from "@/components/marketing/marketingHeader.svelte";
  import MarketingFooter from "@/components/marketing/marketingFooter.svelte";

  let { children }: LayoutProps = $props();

  /** EditStamp useScroll(50) + bg-muted/50 frost on matching page background. */
  let scrolled = $state(false);

  $effect(() => {
    if (!browser) return;
    const onScroll = () => {
      scrolled = window.scrollY > 50;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });
</script>

<div class="flex min-h-screen flex-col bg-background">
  <MarketingAnnouncement />

  <!-- Same formula as EditStamp Navbar: muted/50 + blur over page background -->
  <div
    class={cn(
      "sticky inset-x-0 top-0 z-50 border-b border-neutral-200 transition-all duration-300 dark:border-neutral-800",
      scrolled
        ? "bg-muted/50 backdrop-blur-md supports-backdrop-filter:bg-muted/50"
        : "bg-background",
    )}
  >
    <MarketingHeader />
  </div>

  <main class="flex-1">{@render children?.()}</main>
  <MarketingFooter />
</div>
