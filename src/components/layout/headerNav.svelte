<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "@/utils/cn";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { getAppNavLinks, isAppNavActive } from "@/lib/app-nav";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";

  const i18n = $derived(getI18n());
  const pathname = $derived(stripLocalePrefix(page.url.pathname, LOCALES));
  const links = $derived(getAppNavLinks(i18n));
</script>

<nav class="ml-2 hidden items-center gap-0.5 md:flex">
  {#each links as link (link.href)}
    <InternalLink
      href={link.href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
        "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        isAppNavActive(link.href, pathname) &&
          "bg-brand-energy/15 text-brand-energy dark:bg-brand-energy/25 dark:text-brand",
      )}
    >
      {link.label}
    </InternalLink>
  {/each}
</nav>
