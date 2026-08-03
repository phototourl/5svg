<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import {
    MONETAG_IN_PAGE_PUSH,
    MONETAG_MULTITAG,
    MONETAG_VIGNETTE,
  } from "@/lib/ads/monetag";

  function loadZone(zone: string, src: string, target: "head" | "body" = "body") {
    if (document.querySelector(`script[src="${src}"][data-zone="${zone}"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.dataset.zone = zone;
    script.src = src;
    (target === "head" ? document.head : document.body).appendChild(script);
  }

  onMount(() => {
    if (!browser) return;
    // Multitag Strong (all-in-one) + separate formats for A/B testing on 5svg
    loadZone(MONETAG_MULTITAG.zone, MONETAG_MULTITAG.scriptSrc, "head");
    loadZone(MONETAG_IN_PAGE_PUSH.zone, MONETAG_IN_PAGE_PUSH.scriptSrc);
    loadZone(MONETAG_VIGNETTE.zone, MONETAG_VIGNETTE.scriptSrc);
  });
</script>
