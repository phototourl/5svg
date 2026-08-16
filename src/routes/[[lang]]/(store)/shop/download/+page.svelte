<script lang="ts">
  /**
   * Legacy `/shop/download` — redirects to the product page after sync.
   */
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import {
    buildProductReturnUrl,
    parseShopReturnQuery,
    syncShopOrder,
  } from "@/lib/shop/client-checkout";
  import { getI18n } from "@/lib/i18n/context";
  import { localizePath } from "@/lib/i18n/paths";

  const i18n = $derived(getI18n());

  let status = $state<"loading" | "error">("loading");
  let message = $state("");

  onMount(async () => {
    const { orderToken, checkoutId, isCheckoutReturn } = parseShopReturnQuery(
      page.url.searchParams,
    );

    if (!orderToken) {
      status = "error";
      message = i18n.t("shop.downloadMissing");
      return;
    }

    try {
      const json = await syncShopOrder({
        orderToken,
        locale: i18n.locale,
        creemCheckoutId: checkoutId || undefined,
      });
      if (!json.ok || !json.order?.productSlug) {
        status = "error";
        message = json.error || i18n.t("shop.downloadFailed");
        return;
      }

      const target = localizePath(
        `/shop/${json.order.productSlug}`,
        i18n.locale,
      );
      await goto(
        buildProductReturnUrl(target, orderToken, {
          isCheckoutReturn,
          checkoutId,
        }),
        { replaceState: true },
      );
    } catch {
      status = "error";
      message = i18n.t("shop.downloadFailed");
    }
  });
</script>

<svelte:head>
  <title>{i18n.t("shop.downloadTitle")} — 5SVG</title>
</svelte:head>

<Container className="my-10 max-w-lg">
  <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
    {i18n.t("shop.downloadTitle")}
  </h1>

  {#if status === "loading"}
    <p class="mt-4 text-sm text-neutral-600">{i18n.t("shop.downloadSyncing")}</p>
  {:else}
    <p class="mt-4 text-sm text-red-600">{message}</p>
    <InternalLink href="/shop" className="mt-4 inline-block text-brand-energy dark:text-brand">
      {i18n.t("shop.backToShop")}
    </InternalLink>
  {/if}
</Container>
