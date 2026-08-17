<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto, replaceState } from "$app/navigation";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import CheckoutProcessingOverlay from "@/components/shop/checkoutProcessingOverlay.svelte";
  import ProductPreviewCarousel from "@/components/shop/ProductPreviewCarousel.svelte";
  import CheckoutPanel from "@/components/shop/CheckoutPanel.svelte";
  import type { PayPhase } from "@/lib/shop/pay-phase";
  import { formatUsd } from "@/lib/shop";
  import {
    buildProductReturnUrl,
    downloadZipBlob,
    parseShopReturnQuery,
    syncShopOrder,
  } from "@/lib/shop/client-checkout";
  import { getI18n } from "@/lib/i18n/context";
  import { localizePath } from "@/lib/i18n/paths";

  const i18n = $derived(getI18n());
  const data = $derived(page.data as {
    product: {
      slug: string;
      title: string;
      description: string;
      priceCents: number;
      compareAtCents?: number;
      fileCount: number;
      previewPath: string;
      coverImage?: string;
      license: string;
      category: string;
      kind?: string;
      offer?: string;
      files?: Array<{ path: string; filename: string }>;
    };
    categoryLabel: string;
    sampleTitles: string[];
    isWholeShop: boolean;
    mockCheckout: boolean;
  });

  const isWholeShop = $derived(!!data.isWholeShop);

  const displayCategory = $derived(
    isWholeShop ? i18n.t("shop.wholeShopBadge") : data.categoryLabel,
  );
  const displayTitle = $derived(
    isWholeShop ? i18n.t("shop.wholeShopTitle") : data.product.title,
  );
  const displayDescription = $derived(
    isWholeShop
      ? i18n.t("shop.wholeShopLead", { count: data.product.fileCount })
      : data.product.description,
  );

  const previews = $derived.by(() => {
    if (isWholeShop) {
      return [
        { path: "/og-image.png", filename: displayTitle },
        { path: "/banner1.jpg", filename: displayTitle },
      ];
    }
    if (data.product.files?.length) return data.product.files;
    return [
      { path: data.product.previewPath, filename: data.product.title },
    ];
  });

  let payPhase = $state<PayPhase>("idle");
  let payMessage = $state("");
  let paidOrderToken = $state("");
  let emailHint = $state(false);
  let checkoutHandled = false;

  const overlayOpen = $derived(
    payPhase === "payment" || payPhase === "prepare",
  );
  const overlayTitle = $derived(
    payPhase === "prepare"
      ? i18n.t("shop.prepareOverlayTitle")
      : i18n.t("shop.payOverlayTitle"),
  );
  const overlayBody = $derived(
    payPhase === "prepare"
      ? i18n.t("shop.prepareOverlayBody")
      : i18n.t("shop.payOverlayBody"),
  );

  function cleanReturnQuery() {
    replaceState(page.url.pathname, {});
  }

  async function handlePaymentReturn() {
    if (checkoutHandled || typeof window === "undefined") return;

    const { orderToken, checkoutId, isCheckoutReturn } = parseShopReturnQuery(
      page.url.searchParams,
    );
    if (!orderToken) return;

    checkoutHandled = true;
    payPhase = isCheckoutReturn ? "payment" : "prepare";
    payMessage = "";

    try {
      const json = await syncShopOrder({
        orderToken,
        locale: i18n.locale,
        creemCheckoutId: checkoutId || undefined,
      });
      if (!json.ok) {
        payPhase = "error";
        payMessage = json.error || i18n.t("shop.downloadFailed");
        return;
      }

      const slug = json.order?.productSlug;
      if (slug && slug !== data.product.slug) {
        const target = localizePath(`/shop/${slug}`, i18n.locale);
        await goto(
          buildProductReturnUrl(target, orderToken, {
            isCheckoutReturn,
            checkoutId,
          }),
        );
        return;
      }

      paidOrderToken = orderToken;
      emailHint = !!json.emailSent;
      payPhase = "prepare";
      cleanReturnQuery();
      await downloadZipBlob(
        orderToken,
        `${data.product.slug}.zip`,
        i18n.t("shop.downloadFailed"),
      );
      payPhase = "ready";
    } catch (e) {
      payPhase = "error";
      payMessage =
        e instanceof Error && e.message
          ? e.message
          : i18n.t("shop.downloadFailed");
    }
  }

  onMount(() => {
    void handlePaymentReturn();
  });

  async function buy(email: string) {
    const res = await fetch("/api/shop/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug: data.product.slug,
        email,
        locale: i18n.locale,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || i18n.t("shop.checkoutError"));
    }
    window.location.href = json.checkoutUrl;
  }

  async function retryDownload() {
    if (!paidOrderToken) return;
    payPhase = "prepare";
    payMessage = "";
    try {
      await downloadZipBlob(
        paidOrderToken,
        `${data.product.slug}.zip`,
        i18n.t("shop.downloadFailed"),
      );
      payPhase = "ready";
    } catch (e) {
      payPhase = "error";
      payMessage =
        e instanceof Error && e.message
          ? e.message
          : i18n.t("shop.downloadFailed");
    }
  }
</script>

<CheckoutProcessingOverlay
  open={overlayOpen}
  phase={payPhase === "prepare" ? "prepare" : "payment"}
  title={overlayTitle}
  body={overlayBody}
/>

<svelte:head>
  <title>{displayTitle} — 5SVG</title>
  <meta name="description" content={displayDescription} />
</svelte:head>

<Container className="my-10 max-w-4xl">
  <InternalLink href="/shop" className="text-sm text-brand-energy dark:text-brand">
    ← {i18n.t("shop.backToShop")}
  </InternalLink>

  <div class="mt-6 grid min-w-0 items-start gap-8 md:grid-cols-2">
    <div class="min-w-0">
      <ProductPreviewCarousel
        previews={previews}
        label={displayTitle}
        variant={isWholeShop ? "wholeShop" : "pack"}
      />
    </div>

    <div class="min-w-0">
      <div class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
        {displayCategory}
      </div>
      <h1 class="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {displayTitle}
      </h1>
      <div class="mt-4 flex items-baseline gap-2">
        <span class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          {formatUsd(data.product.priceCents)}
        </span>
        {#if data.product.compareAtCents && data.product.compareAtCents > data.product.priceCents}
          <span class="text-neutral-400 line-through">
            {formatUsd(data.product.compareAtCents)}
          </span>
        {/if}
      </div>
      <p class="mt-1 text-xs text-neutral-500">
        {i18n.t("shop.fileCount", { count: data.product.fileCount })} ·
        {i18n.t(`shop.license.${data.product.license}`)}
      </p>

      <p class="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {displayDescription}
      </p>

      {#if data.sampleTitles.length}
        <ul class="mt-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
          <li class="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {i18n.t("shop.includesSample")}
          </li>
          {#each data.sampleTitles as title (title)}
            <li class="font-mono text-xs">{title}</li>
          {/each}
          {#if data.product.fileCount > data.sampleTitles.length}
            <li class="text-neutral-400">
              {i18n.t("shop.moreFiles", {
                count: data.product.fileCount - data.sampleTitles.length,
              })}
            </li>
          {/if}
        </ul>
      {/if}

      <!-- EditStamp-style: mobile sticky pay strip; desktop inline card -->
      {#if payPhase === "idle" || payPhase === "error" || payPhase === "ready"}
        <div
          class="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white px-4 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:static md:z-auto md:mt-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-neutral-800 dark:bg-neutral-950 md:dark:bg-transparent"
          id="checkout"
        >
          <div class="mx-auto max-w-4xl md:max-w-none">
            <CheckoutPanel
              phase={payPhase}
              displayTitle={displayTitle}
              mockCheckout={data.mockCheckout}
              payMessage={payMessage}
              emailHint={emailHint}
              canRetry={!!paidOrderToken}
              priceCents={data.product.priceCents}
              compareAtCents={data.product.compareAtCents}
              docked
              onBuy={buy}
              onRetry={retryDownload}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
</Container>
