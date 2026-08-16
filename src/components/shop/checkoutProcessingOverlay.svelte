<script lang="ts">
  import { browser } from "$app/environment";
  import { cn } from "@/utils/cn";

  type Phase = "payment" | "prepare";

  let {
    open = false,
    phase = "payment" as Phase,
    title,
    body,
  }: {
    open?: boolean;
    phase?: Phase;
    title: string;
    body: string;
  } = $props();
</script>

{#if open && browser}
  <div
    class={cn(
      "fixed inset-0 z-[100] flex items-center justify-center",
      "bg-black/55 backdrop-blur-[3px]",
    )}
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div
      class="pointer-events-auto w-[min(92vw,22rem)] rounded-2xl border border-neutral-200 bg-white/95 px-8 py-9 text-center shadow-2xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-950/95"
    >
      <div class="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
        <div
          class="absolute inset-0 rounded-full border-[3px] border-brand/10"
          aria-hidden="true"
        ></div>
        <div
          class="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-brand border-r-brand/35"
          aria-hidden="true"
        ></div>
        <div class="relative h-2.5 w-2.5 rounded-full bg-brand" aria-hidden="true"></div>
      </div>

      <p class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </p>
      <p class="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {body}
      </p>

      <div
        class="mx-auto mt-6 h-1 w-36 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
        aria-hidden="true"
      >
        <div class="h-full w-2/5 animate-pulse rounded-full bg-brand/60"></div>
      </div>

      <span class="sr-only">{phase}</span>
    </div>
  </div>
{/if}
