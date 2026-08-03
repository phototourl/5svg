<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { MONETAG_IN_PAGE_PUSH, MONETAG_VIGNETTE } from "@/lib/ads/monetag";

  function loadZone(zone: string, src: string) {
    if (document.querySelector(`script[src="${src}"][data-zone="${zone}"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.dataset.zone = zone;
    script.src = src;
    document.body.appendChild(script);
  }

  onMount(() => {
    if (!browser) return;
    loadZone(MONETAG_IN_PAGE_PUSH.zone, MONETAG_IN_PAGE_PUSH.scriptSrc);
    loadZone(MONETAG_VIGNETTE.zone, MONETAG_VIGNETTE.scriptSrc);
  });
</script>
