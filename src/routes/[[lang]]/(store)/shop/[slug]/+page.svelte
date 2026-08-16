<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { page } from "$app/state";
  import { goto, replaceState } from "$app/navigation";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import CheckoutProcessingOverlay from "@/components/shop/checkoutProcessingOverlay.svelte";
  import { formatUsd } from "@/lib/shop";
  import { getI18n } from "@/lib/i18n/context";
  import { localizePath } from "@/lib/i18n/paths";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

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

  /** Whole-shop detail only: two marketing stills (shop list unchanged). */
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

  let index = $state(0);
  let paused = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;

  const current = $derived(previews[index] ?? previews[0]!);

  function go(delta: number) {
    const n = previews.length;
    if (n <= 1) return;
    index = (index + delta + n) % n;
  }

  function goTo(i: number) {
    index = i;
  }

  function startAuto() {
    stopAuto();
    if (previews.length <= 1) return;
    timer = setInterval(() => {
      if (!paused) go(1);
    }, 3500);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  let email = $state("");
  let busy = $state(false);
  let err = $state("");

  /** idle | payment overlay | prepare overlay | ready | error */
  let payPhase = $state<"idle" | "payment" | "prepare" | "ready" | "error">(
    "idle",
  );
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

  /** Stay on page — never navigate to /api/shop/download (that caused the 404 screen). */
  async function downloadZipBlob(token: string): Promise<void> {
    const res = await fetch(
      `/api/shop/download?order_token=${encodeURIComponent(token)}`,
    );
    if (!res.ok) {
      let msg = i18n.t("shop.downloadFailed");
      try {
        const j = (await res.json()) as { error?: string };
        if (j.error) msg = j.error;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    const blob = await res.blob();
    const cd = res.headers.get("Content-Disposition") || "";
    const match = /filename="?([^";]+)"?/i.exec(cd);
    const filename = match?.[1] || `${data.product.slug}.zip`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function cleanReturnQuery() {
    replaceState(page.url.pathname, {});
  }

  async function handlePaymentReturn() {
    if (checkoutHandled || typeof window === "undefined") return;

    const params = page.url.searchParams;
    const token = params.get("order_token")?.trim() || "";
    const checkoutId =
      params.get("checkout_id")?.trim() ||
      params.get("checkoutId")?.trim() ||
      "";
    const isCheckoutReturn =
      params.get("checkout") === "success" || !!checkoutId;

    if (!token) return;

    checkoutHandled = true;
    // Payment return → payment loading; email backup link → prepare loading
    payPhase = isCheckoutReturn ? "payment" : "prepare";
    payMessage = "";

    try {
      const res = await fetch("/api/shop/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderToken: token,
          locale: i18n.locale,
          creemCheckoutId: checkoutId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        payPhase = "error";
        payMessage = json.error || i18n.t("shop.downloadFailed");
        return;
      }

      const slug = json.order?.productSlug as string | undefined;
      if (slug && slug !== data.product.slug) {
        const target = localizePath(`/shop/${slug}`, i18n.locale);
        const q = new URLSearchParams({ order_token: token });
        if (isCheckoutReturn) q.set("checkout", "success");
        if (checkoutId) q.set("checkout_id", checkoutId);
        await goto(`${target}?${q.toString()}`);
        return;
      }

      paidOrderToken = token;
      emailHint = !!json.emailSent;
      payPhase = "prepare";
      cleanReturnQuery();
      await downloadZipBlob(token);
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
    startAuto();
    void handlePaymentReturn();
  });

  onDestroy(() => {
    stopAuto();
  });

  async function buy() {
    err = "";
    busy = true;
    try {
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
        err = json.error || i18n.t("shop.checkoutError");
        return;
      }
      window.location.href = json.checkoutUrl;
    } catch {
      err = i18n.t("shop.checkoutError");
    } finally {
      busy = false;
    }
  }

  async function retryDownload() {
    if (!paidOrderToken) return;
    payPhase = "prepare";
    payMessage = "";
    try {
      await downloadZipBlob(paidOrderToken);
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

{#snippet checkoutBlock()}
  {#if payPhase === "error"}
    <div class="space-y-3 rounded-2xl border border-red-200 p-4 dark:border-red-900">
      <p class="text-sm text-red-600">{payMessage}</p>
      {#if paidOrderToken}
        <Button type="button" variant="default" class="w-full" onclick={() => void retryDownload()}>
          {i18n.t("shop.downloadZip")}
        </Button>
      {/if}
    </div>
  {:else if payPhase === "ready"}
    <div
      class="space-y-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 dark:border-brand/40"
    >
      <p class="text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {i18n.t("shop.downloadReady", { title: displayTitle })}
      </p>
      {#if emailHint}
        <p class="text-sm text-neutral-600 dark:text-neutral-400">
          {i18n.t("shop.downloadEmailHint")}
        </p>
      {/if}
      <Button type="button" variant="default" class="w-full" onclick={() => void retryDownload()}>
        {i18n.t("shop.downloadZip")}
      </Button>
    </div>
  {:else if payPhase === "idle"}
    <form
      class="space-y-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
      onsubmit={(e) => {
        e.preventDefault();
        void buy();
      }}
    >
      <label class="block text-sm font-medium text-neutral-800 dark:text-neutral-200">
        {i18n.t("shop.emailLabel")}
        <input
          type="email"
          required
          bind:value={email}
          placeholder="you@email.com"
          class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />
      </label>
      {#if data.mockCheckout}
        <p class="text-xs text-amber-700 dark:text-amber-400">
          {i18n.t("shop.mockNotice")}
        </p>
      {/if}
      {#if err}
        <p class="text-sm text-red-600">{err}</p>
      {/if}
      <Button type="submit" variant="default" class="w-full" disabled={busy}>
        {busy ? i18n.t("shop.processing") : i18n.t("shop.buyDownload")}
      </Button>
      <p class="text-xs text-neutral-500">{i18n.t("shop.flowHint")}</p>
    </form>
  {/if}
{/snippet}

{#snippet productMeta()}
  <div class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
    {displayCategory}
  </div>
  <h1 class="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {displayTitle}
  </h1>
  <p class="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
    {displayDescription}
  </p>
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
{/snippet}

<Container className="my-10 max-w-4xl">
  <InternalLink href="/shop" className="text-sm text-brand-energy dark:text-brand">
    ← {i18n.t("shop.backToShop")}
  </InternalLink>

  <div class="mt-6 grid items-start gap-8 md:grid-cols-2">
    <div
      class="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={displayTitle}
      onmouseenter={() => (paused = true)}
      onmouseleave={() => (paused = false)}
    >
      <div
        class={isWholeShop
          ? "relative aspect-[16/10] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-100"
          : "flex min-h-80 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-100"}
      >
        <img
          src={current.path}
          alt={current.filename}
          class={isWholeShop
            ? "absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300"
            : "max-h-80 w-full max-w-full object-contain transition-opacity duration-300"}
        />
      </div>

      {#if previews.length > 1}
        <button
          type="button"
          class="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-brand-energy text-[#22c55e] shadow-sm transition hover:scale-110 hover:bg-brand-energy-hover dark:bg-brand dark:text-brand-energy dark:hover:bg-brand-hover"
          aria-label="Previous preview"
          onclick={() => go(-1)}
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-brand-energy text-[#22c55e] shadow-sm transition hover:scale-110 hover:bg-brand-energy-hover dark:bg-brand dark:text-brand-energy dark:hover:bg-brand-hover"
          aria-label="Next preview"
          onclick={() => go(1)}
        >
          <ChevronRight class="h-5 w-5" />
        </button>

        <div class="mt-3 flex items-center justify-center gap-2">
          {#each previews as preview, i (preview.path)}
            <button
              type="button"
              class="h-2 w-2 rounded-full transition-colors {i === index
                ? 'bg-brand'
                : 'bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600'}"
              aria-label={`Preview ${i + 1}`}
              aria-current={i === index}
              onclick={() => goTo(i)}
            ></button>
          {/each}
        </div>

        <p class="mt-2 truncate text-center font-mono text-xs text-neutral-500">
          {#if isWholeShop}
            {index + 1}/{previews.length}
          {:else}
            {index + 1}/{previews.length} · {current.filename}
          {/if}
        </p>

        <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
          {#each previews as preview, i (preview.path)}
            <button
              type="button"
              class="shrink-0 overflow-hidden rounded-lg border bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-100 {isWholeShop
                ? 'h-14 w-20'
                : 'h-14 w-14 p-1'} {i === index
                ? 'border-brand ring-1 ring-brand'
                : 'border-neutral-200 dark:border-neutral-600'}"
              onclick={() => goTo(i)}
            >
              <img
                src={preview.path}
                alt={preview.filename}
                class="h-full w-full {isWholeShop
                  ? 'object-cover object-center'
                  : 'object-contain'}"
              />
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div>
      {@render productMeta()}

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

      <div class="mt-6">
        {@render checkoutBlock()}
      </div>
    </div>
  </div>
</Container>
