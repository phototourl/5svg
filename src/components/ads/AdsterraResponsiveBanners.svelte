<script lang="ts">
  /**
   * Low-impact banners: 320x50 on small screens, 728x90 on md+.
   */
  import AdsterraBanner from "@/components/ads/AdsterraBanner.svelte";
  import { ADSTERRA_BANNER_320x50, ADSTERRA_BANNER_728x90 } from "@/lib/ads/adsterra";
  import { cn } from "@/utils/cn";

  let { class: className = "" }: { class?: string } = $props();
</script>

<div class={cn("w-full py-3", className)}>
  <div class="md:hidden">
    <AdsterraBanner unit={ADSTERRA_BANNER_320x50} />
  </div>
  <div class="hidden md:block">
    <AdsterraBanner unit={ADSTERRA_BANNER_728x90} />
  </div>
</div>
