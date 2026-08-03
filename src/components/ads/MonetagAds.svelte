<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { MONETAG_MULTITAG } from "@/lib/ads/monetag";

  onMount(() => {
    if (!browser) return;
    if (
      document.querySelector(
        `script[src="${MONETAG_MULTITAG.scriptSrc}"][data-zone="${MONETAG_MULTITAG.zone}"]`,
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.dataset.zone = MONETAG_MULTITAG.zone;
    script.src = MONETAG_MULTITAG.scriptSrc;
    document.head.appendChild(script);
  });
</script>
