<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import {
    LOCALES,
    localeMeta,
    LOCALE_COOKIE,
    flagIconUrl,
    type AppLocale,
  } from "@/lib/i18n/config";
  import { switchLocalePath } from "@/lib/i18n/paths";
  import { getI18n } from "@/lib/i18n/context";
  import { cn } from "@/utils/cn";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import X from "@lucide/svelte/icons/x";

  const i18n = $derived(getI18n());

  let open = $state(false);

  function pick(next: AppLocale) {
    const target = switchLocalePath(page.url.pathname, next, LOCALES);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    open = false;
    void goto(target);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") open = false;
  }

  $effect(() => {
    if (!browser || !open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    window.addEventListener("keydown", onKeydown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      window.removeEventListener("keydown", onKeydown);
    };
  });
</script>

<button
  type="button"
  class={cn(
    "inline-flex h-8 items-center gap-1 rounded-md border border-neutral-200 bg-white/80 px-2 text-xs font-medium text-neutral-600 backdrop-blur",
    "transition hover:border-brand/70 hover:text-brand",
    "dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-300 lg:h-9 lg:gap-2 lg:px-3",
  )}
  aria-expanded={open}
  aria-haspopup="dialog"
  onclick={() => (open = true)}
>
  <img
    src={flagIconUrl(i18n.locale)}
    alt=""
    width="21"
    height="14"
    class="h-3.5 w-auto rounded-[2px]"
    decoding="async"
  />
  <span class="hidden whitespace-nowrap lg:inline">
    {localeMeta[i18n.locale].name}
  </span>
  <ChevronDown size={12} class="text-neutral-400" aria-hidden="true" />
</button>

{#if open && browser}
  <!-- EditStamp-style language select modal -->
  <div
    class="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
    onclick={() => (open = false)}
    role="presentation"
  ></div>
  <div
    class="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center pt-24 sm:pt-28"
  >
    <div
      class="pointer-events-auto w-[calc(100%-1.5rem)] max-w-7xl rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-950"
      role="dialog"
      aria-modal="true"
      aria-label={i18n.t("common.languageSelect.title")}
      onclick={(e) => e.stopPropagation()}
    >
      <div
        class="flex items-center justify-between border-b border-neutral-200 px-6 py-5 sm:px-8 sm:py-6 dark:border-neutral-800"
      >
        <div>
          <h2 class="text-sm font-semibold text-neutral-900 sm:text-base dark:text-neutral-50">
            {i18n.t("common.languageSelect.title")}
          </h2>
          <p class="mt-1 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
            {i18n.t("common.languageSelect.subtitle")}
          </p>
        </div>
        <button
          type="button"
          class="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          aria-label={i18n.t("common.languageSelect.close")}
          onclick={() => (open = false)}
        >
          <X size={16} />
        </button>
      </div>

      <div class="max-h-[60vh] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
        <div
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6"
        >
          {#each LOCALES as code (code)}
            {@const active = code === i18n.locale}
            <button
              type="button"
              class={cn(
                "flex min-w-[7rem] items-center gap-2.5 rounded-lg border px-3 py-3.5 text-left text-xs transition sm:min-w-[10rem] sm:px-3.5 sm:py-4 sm:text-sm",
                active
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-neutral-200 hover:border-brand/60 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900",
              )}
              onclick={() => pick(code)}
            >
              <img
                src={flagIconUrl(code)}
                alt=""
                width="24"
                height="16"
                class="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <span class="whitespace-nowrap">{localeMeta[code].name}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}
