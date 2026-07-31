<script lang="ts">
  /**
   * Adsterra Social Bar — same pattern as phototourl.
   * Publisher docs: place above closing </body>. Renders nothing; only injects script.
   */
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { ADSTERRA_SOCIAL_BAR } from "@/lib/ads/adsterra";

  onMount(() => {
    if (!browser) return;
    if (document.querySelector(`script[src="${ADSTERRA_SOCIAL_BAR.scriptSrc}"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = ADSTERRA_SOCIAL_BAR.scriptSrc;
    script.setAttribute("data-adsterra-social", "1");
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  });
</script>
