<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { ADSTERRA_NATIVE_BANNER } from "@/lib/ads/adsterra";

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

<aside class="w-full" data-adsterra-native aria-label="Advertisement">
  <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6">
    <div id={ADSTERRA_NATIVE_BANNER.containerId}></div>
  </div>
</aside>
