<script lang="ts">
  import { cn } from "@/utils/cn";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import { getI18n } from "@/lib/i18n/context";

  export const PAGE_SIZE_OPTIONS = [50, 100, 150, 200, 500, 1000] as const;
  export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

  interface Props {
    total: number;
    page: number;
    pageSize: number;
    class?: string;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  }

  let {
    total,
    page,
    pageSize,
    class: className = "",
    onPageChange,
    onPageSizeChange,
  }: Props = $props();

  const i18n = $derived(getI18n());

  const totalPages = $derived(Math.max(1, Math.ceil(total / pageSize)));

  let jumpInput = $state("");

  $effect(() => {
    jumpInput = String(page);
  });

  const pageButtons = $derived.by(() => {
    const pages = totalPages;
    const current = Math.min(page, pages);
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const set = new Set<number>([1, pages, current]);
    for (const p of [current - 1, current + 1]) {
      if (p >= 1 && p <= pages) set.add(p);
    }
    return [...set].sort((a, b) => a - b);
  });

  const btn =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border px-2 text-sm transition disabled:pointer-events-none disabled:opacity-40";
  const btnIdle =
    "border-neutral-200 bg-white text-neutral-700 hover:border-brand hover:text-brand dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:border-brand dark:hover:text-brand";
  const btnActive =
    "border-brand bg-brand text-brand-foreground";

  function go(next: number) {
    const clamped = Math.min(Math.max(1, next), totalPages);
    if (clamped !== page) onPageChange(clamped);
  }

  function submitJump() {
    const n = Number.parseInt(jumpInput.trim(), 10);
    if (!Number.isFinite(n)) {
      jumpInput = String(page);
      return;
    }
    go(n);
  }
</script>

{#if total > 0}
  <div
    class={cn(
      "mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-neutral-200 pt-5 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300",
      className,
    )}
  >
    <span class="whitespace-nowrap">
      {i18n.t("Ui.totalCount", { total })}
    </span>

    <select
      class="h-8 rounded-md border border-neutral-200 bg-white px-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
      value={pageSize}
      aria-label={i18n.t("Ui.perPage")}
      onchange={(e) => {
        const next = Number((e.currentTarget as HTMLSelectElement).value);
        if (PAGE_SIZE_OPTIONS.includes(next as PageSizeOption)) {
          onPageSizeChange(next);
        }
      }}
    >
      {#each PAGE_SIZE_OPTIONS as size (size)}
        <option value={size}>{i18n.t("Ui.perPageOption", { count: size })}</option>
      {/each}
    </select>

    <div class="flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        class={cn(btn, btnIdle)}
        aria-label={i18n.t("Ui.prevPage")}
        disabled={page <= 1}
        onclick={() => go(page - 1)}
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      {#each pageButtons as p, i (p)}
        {#if i > 0 && p - pageButtons[i - 1]! > 1}
          <span class="px-1 text-neutral-400" aria-hidden="true">…</span>
        {/if}
        <button
          type="button"
          class={cn(btn, p === page ? btnActive : btnIdle)}
          aria-current={p === page ? "page" : undefined}
          onclick={() => go(p)}
        >
          {p}
        </button>
      {/each}

      <button
        type="button"
        class={cn(btn, btnIdle)}
        aria-label={i18n.t("Ui.nextPage")}
        disabled={page >= totalPages}
        onclick={() => go(page + 1)}
      >
        <ChevronRight class="h-4 w-4" />
      </button>
    </div>

    <form
      class="flex items-center gap-1.5"
      onsubmit={(e) => {
        e.preventDefault();
        submitJump();
      }}
    >
      <span class="whitespace-nowrap">{i18n.t("Ui.goToPage")}</span>
      <input
        type="text"
        inputmode="numeric"
        class="h-8 w-14 rounded-md border border-neutral-200 bg-white px-2 text-center text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50"
        bind:value={jumpInput}
        aria-label={i18n.t("Ui.goToPage")}
        onblur={submitJump}
        onkeydown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitJump();
          }
        }}
      />
      {#if i18n.t("Ui.pageSuffix")}
        <span class="whitespace-nowrap">{i18n.t("Ui.pageSuffix")}</span>
      {/if}
    </form>
  </div>
{/if}
