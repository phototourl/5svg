<script lang="ts">
  /**
   * Adsterra Native Banner — same pattern as phototourl.
   * Loads invoke.js once and mounts the publisher container.
   */
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { ADSTERRA_NATIVE_BANNER } from "@/lib/ads/adsterra";
  import { cn } from "@/utils/cn";

  let { class: className = "" }: { class?: string } = $props();

  onMount(() => {
    if (!browser) return;
    if (document.querySelector(`script[src="${ADSTERRA_NATIVE_BANNER.scriptSrc}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = ADSTERRA_NATIVE_BANNER.scriptSrc;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  });
</script>

<aside
  class={cn("w-full", className)}
  data-adsterra-native
  aria-label="Advertisement"
>
  <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6">
    <div id={ADSTERRA_NATIVE_BANNER.containerId}></div>
  </div>
</aside>
