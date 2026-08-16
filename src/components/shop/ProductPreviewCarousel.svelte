<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  type Preview = { path: string; filename: string };

  interface Props {
    previews: Preview[];
    label: string;
    variant?: "pack" | "wholeShop";
  }

  let { previews, label, variant = "pack" }: Props = $props();

  const isWholeShop = $derived(variant === "wholeShop");

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

  onMount(() => {
    startAuto();
  });

  onDestroy(() => {
    stopAuto();
  });
</script>

<div
  class="relative"
  role="region"
  aria-roledescription="carousel"
  aria-label={label}
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
