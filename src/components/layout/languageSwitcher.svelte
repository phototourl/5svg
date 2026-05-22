<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { LOCALES, localeMeta, LOCALE_COOKIE, type AppLocale } from "@/lib/i18n/config";
  import { switchLocalePath } from "@/lib/i18n/paths";
  import { getI18n } from "@/lib/i18n/context";
  import { cn } from "@/utils/cn";
  import Globe from "@lucide/svelte/icons/globe";
  import Check from "@lucide/svelte/icons/check";

  const i18n = $derived(getI18n());

  let open = $state(false);

  function pick(next: AppLocale) {
    const target = switchLocalePath(page.url.pathname, next, LOCALES);
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    open = false;
    void goto(target);
  }
</script>

<div class="relative">
  <button
    type="button"
    class={cn(
      "inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700",
      "hover:border-brand/40 hover:text-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300",
    )}
    aria-expanded={open}
    aria-haspopup="listbox"
    onclick={() => (open = !open)}
  >
    <Globe size={14} strokeWidth={1.75} aria-hidden="true" />
    <span>{localeMeta[i18n.locale].name}</span>
  </button>

  {#if open}
    <div
      class="absolute right-0 z-50 mt-2 max-h-72 w-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
      role="listbox"
      aria-label={i18n.t("common.languageSelect.title")}
    >
      {#each LOCALES as code (code)}
        <button
          type="button"
          role="option"
          aria-selected={code === i18n.locale}
          class={cn(
            "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800",
            code === i18n.locale && "text-brand font-medium",
          )}
          onclick={() => pick(code)}
        >
          <span>{localeMeta[code].name}</span>
          {#if code === i18n.locale}
            <Check size={14} aria-hidden="true" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
