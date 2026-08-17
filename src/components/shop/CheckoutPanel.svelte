<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { formatUsd } from "@/lib/shop";
  import { cn } from "@/utils/cn";
  import type { PayPhase } from "@/lib/shop/pay-phase";

  interface Props {
    phase: PayPhase;
    displayTitle: string;
    mockCheckout?: boolean;
    payMessage?: string;
    emailHint?: boolean;
    canRetry?: boolean;
    priceCents?: number;
    compareAtCents?: number;
    /** Mobile bottom dock (EditStamp-style sticky pay) */
    docked?: boolean;
    class?: string;
    onBuy: (email: string) => void | Promise<void>;
    onRetry?: () => void | Promise<void>;
  }

  let {
    phase,
    displayTitle,
    mockCheckout = false,
    payMessage = "",
    emailHint = false,
    canRetry = false,
    priceCents,
    compareAtCents,
    docked = false,
    class: className = "",
    onBuy,
    onRetry,
  }: Props = $props();

  const i18n = $derived(getI18n());

  let email = $state("");
  let busy = $state(false);
  let err = $state("");

  const priceLabel = $derived(
    priceCents != null ? formatUsd(priceCents) : "",
  );

  const buyLabel = $derived(
    busy
      ? i18n.t("shop.processing")
      : priceLabel
        ? `${i18n.t("shop.buyDownload")} · ${priceLabel}`
        : i18n.t("shop.buyDownload"),
  );

  async function submit() {
    err = "";
    busy = true;
    try {
      await onBuy(email);
    } catch (e) {
      err =
        e instanceof Error && e.message
          ? e.message
          : i18n.t("shop.checkoutError");
    } finally {
      busy = false;
    }
  }
</script>

{#if phase === "error"}
  <div
    class={cn(
      "space-y-3 rounded-2xl border border-red-200 p-4 dark:border-red-900",
      docked && "rounded-none border-0 p-0 md:rounded-2xl md:border md:p-4",
      className,
    )}
  >
    <p class="text-sm text-red-600">{payMessage}</p>
    {#if canRetry && onRetry}
      <Button
        type="button"
        variant="default"
        class="h-11 w-full rounded-xl text-sm font-semibold"
        onclick={() => void onRetry()}
      >
        {i18n.t("shop.downloadZip")}
      </Button>
    {/if}
  </div>
{:else if phase === "ready"}
  <div
    class={cn(
      "space-y-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 dark:border-brand/40",
      docked &&
        "rounded-none border-0 bg-transparent p-0 md:rounded-2xl md:border md:bg-brand/5 md:p-4",
      className,
    )}
  >
    <p class="text-sm font-medium text-neutral-900 dark:text-neutral-50">
      {i18n.t("shop.downloadReady", { title: displayTitle })}
    </p>
    <p class="text-sm text-neutral-600 dark:text-neutral-400">
      {i18n.t("shop.downloadStarted")}
    </p>
    {#if emailHint}
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {i18n.t("shop.downloadEmailHint")}
      </p>
    {/if}
    {#if onRetry}
      <Button
        type="button"
        variant="default"
        class="h-11 w-full rounded-xl text-sm font-semibold"
        onclick={() => void onRetry()}
      >
        {i18n.t("shop.downloadAgain")}
      </Button>
    {/if}
  </div>
{:else if phase === "idle"}
  <form
    class={cn(
      docked
        ? "space-y-2.5 md:space-y-3 md:rounded-2xl md:border md:border-brand/30 md:bg-brand/5 md:p-4 dark:md:border-brand/40"
        : "space-y-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 dark:border-brand/40",
      className,
    )}
    onsubmit={(e) => {
      e.preventDefault();
      void submit();
    }}
  >
    {#if docked}
      <div class="flex items-baseline justify-between gap-3 md:hidden">
        <p class="min-w-0 truncate text-xs font-medium text-neutral-500">
          {displayTitle}
        </p>
        {#if compareAtCents != null && priceCents != null && compareAtCents > priceCents}
          <span class="shrink-0 text-xs text-neutral-400 line-through">
            {formatUsd(compareAtCents)}
          </span>
        {/if}
      </div>
    {:else if priceCents != null}
      <div class="flex items-baseline gap-2">
        <span class="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          {priceLabel}
        </span>
        {#if compareAtCents != null && compareAtCents > priceCents}
          <span class="text-sm text-neutral-400 line-through">
            {formatUsd(compareAtCents)}
          </span>
        {/if}
      </div>
    {/if}

    {#if docked}
      <div class="hidden items-baseline gap-2 md:flex">
        {#if priceCents != null}
          <span class="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {priceLabel}
          </span>
          {#if compareAtCents != null && compareAtCents > priceCents}
            <span class="text-sm text-neutral-400 line-through">
              {formatUsd(compareAtCents)}
            </span>
          {/if}
        {/if}
      </div>
    {/if}

    <label class="block">
      <span
        class={docked
          ? "sr-only md:not-sr-only md:mb-1 md:block md:text-sm md:font-medium md:text-neutral-800 dark:md:text-neutral-200"
          : "mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200"}
      >
        {i18n.t("shop.emailLabel")}
      </span>
      <input
        type="email"
        required
        bind:value={email}
        placeholder={docked ? i18n.t("shop.emailLabel") : "you@email.com"}
        autocomplete="email"
        class="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base dark:border-neutral-700 dark:bg-neutral-950"
      />
    </label>

    {#if mockCheckout}
      <p class="text-xs text-amber-700 dark:text-amber-400">
        {i18n.t("shop.mockNotice")}
      </p>
    {/if}
    {#if err}
      <p class="text-sm text-red-600">{err}</p>
    {/if}

    <Button
      type="submit"
      variant="default"
      class="h-11 w-full rounded-xl text-sm font-semibold"
      disabled={busy}
    >
      {buyLabel}
    </Button>
    <p class="text-xs leading-snug text-neutral-500">{i18n.t("shop.flowHint")}</p>
  </form>
{/if}
