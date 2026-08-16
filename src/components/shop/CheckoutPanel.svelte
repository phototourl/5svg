<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import type { PayPhase } from "@/lib/shop/pay-phase";

  interface Props {
    phase: PayPhase;
    displayTitle: string;
    mockCheckout?: boolean;
    payMessage?: string;
    emailHint?: boolean;
    canRetry?: boolean;
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
    onBuy,
    onRetry,
  }: Props = $props();

  const i18n = $derived(getI18n());

  let email = $state("");
  let busy = $state(false);
  let err = $state("");

  async function submit() {
    err = "";
    busy = true;
    try {
      await onBuy(email);
    } catch (e) {
      err = e instanceof Error && e.message ? e.message : i18n.t("shop.checkoutError");
    } finally {
      busy = false;
    }
  }
</script>

{#if phase === "error"}
  <div class="space-y-3 rounded-2xl border border-red-200 p-4 dark:border-red-900">
    <p class="text-sm text-red-600">{payMessage}</p>
    {#if canRetry && onRetry}
      <Button type="button" variant="default" class="w-full" onclick={() => void onRetry()}>
        {i18n.t("shop.downloadZip")}
      </Button>
    {/if}
  </div>
{:else if phase === "ready"}
  <div
    class="space-y-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 dark:border-brand/40"
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
        class="w-full"
        onclick={() => void onRetry()}
      >
        {i18n.t("shop.downloadAgain")}
      </Button>
    {/if}
  </div>
{:else if phase === "idle"}
  <form
    class="space-y-3 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
    onsubmit={(e) => {
      e.preventDefault();
      void submit();
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
    {#if mockCheckout}
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
