<script lang="ts">
  /**
   * Adsterra iframe banner (atOptions + highperformanceformat invoke.js).
   */
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import type { AdsterraIframeBanner } from "@/lib/ads/adsterra";
  import { cn } from "@/utils/cn";

  let {
    unit,
    class: className = "",
  }: {
    unit: AdsterraIframeBanner;
    class?: string;
  } = $props();

  let host: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (!browser || !host) return;

    (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
      key: unit.key,
      format: "iframe",
      height: unit.height,
      width: unit.width,
      params: {},
    };

    const script = document.createElement("script");
    script.src = unit.scriptSrc;
    host.appendChild(script);

    return () => {
      host?.replaceChildren();
    };
  });
</script>

<aside
  class={cn("flex w-full justify-center", className)}
  data-adsterra-banner={`${unit.width}x${unit.height}`}
  aria-label="Advertisement"
>
  <div
    bind:this={host}
    class="overflow-hidden"
    style:width={`${unit.width}px`}
    style:min-height={`${unit.height}px`}
  ></div>
</aside>
