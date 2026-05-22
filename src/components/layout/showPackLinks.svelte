<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "@/utils/cn";
  import { iconPacks } from "@/config/icon-packs";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { sidebarItemClasses } from "@/components/layout/sidebarItemClasses";
  import { getI18n } from "@/lib/i18n/context";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";

  const i18n = $derived(getI18n());
  const pathname = $derived(stripLocalePrefix(page.url.pathname, LOCALES));
</script>

<h2
  class="mb-1 px-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
>
  {i18n.t("common.sidebar.iconPacks")}
</h2>
{#each iconPacks as pack (pack.id)}
  <InternalLink
    href={`/more/${pack.id}`}
    preloadData={true}
    className={cn(
      sidebarItemClasses.base,
      pathname === `/more/${pack.id}` && sidebarItemClasses.active,
      "pr-3",
    )}
  >
    <p class="truncate text-sm font-normal">{pack.name}</p>
  </InternalLink>
{/each}
