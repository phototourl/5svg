<script lang="ts">
  import { brand } from "@/brand";
  import { cn } from "@/utils/cn";
  import { globals } from "@/globals";
  import { page } from "$app/state";
  import favoritesStore from "@/stores/favorites.store";
  import ExternalLink from "@/components/ui/links/external-link.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { sidebarItemClasses } from "@/components/layout/sidebarItemClasses";
  import { sidebarBadgeClasses } from "@/components/layout/sidebarBadgeClasses";
  import { getI18n } from "@/lib/i18n/context";
  import { getAppNavLinks, isAppNavActive } from "@/lib/app-nav";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";

  import Box from "@lucide/svelte/icons/box";
  import House from "@lucide/svelte/icons/house";
  import Heart from "@lucide/svelte/icons/heart";
  import Cloud from "@lucide/svelte/icons/cloud";
  import Submit from "@lucide/svelte/icons/send";
  import Layers from "@lucide/svelte/icons/layers";
  import LayoutGrid from "@lucide/svelte/icons/layout-grid";
  import Github from "@/components/logos/github.svelte";
  import Shadcn from "@/components/logos/shadcn.svelte";

  const i18n = $derived(getI18n());
  const pathname = $derived(stripLocalePrefix(page.url.pathname, LOCALES));
  const links = $derived(getAppNavLinks(i18n));

  let favorites = $derived($favoritesStore);
  let favoritesCount = $derived(favoritesStore.getCount(favorites));

  function navIcon(href: string) {
    switch (href) {
      case "/library":
        return House;
      case "/browse":
        return LayoutGrid;
      case "/favorites":
        return Heart;
      case "/more":
        return Layers;
      case "/docs/api":
        return Cloud;
      case "/extensions":
        return Box;
      default:
        return House;
    }
  }
</script>

{#each links as link (link.href)}
  <InternalLink
    href={link.href}
    preloadData={true}
    className={cn(
      sidebarItemClasses.base,
      link.href === "/favorites" ? "justify-between" : "justify-start space-x-3",
      isAppNavActive(link.href, pathname) && sidebarItemClasses.active,
    )}
  >
    {#if link.href === "/favorites"}
      <div class="flex items-center space-x-3">
        <Heart size={16} />
        <p class="truncate">{link.label}</p>
      </div>
      {#if favoritesCount > 0}
        <span
          class={cn(
            sidebarBadgeClasses,
            page.url.pathname && "border-transparent",
          )}
        >
          {favoritesCount}
        </span>
      {/if}
    {:else}
      {@const Icon = navIcon(link.href)}
      <Icon size={16} />
      <p class="truncate">{link.label}</p>
    {/if}
  </InternalLink>
{/each}
{#if brand.showDeveloperTools}
  <InternalLink
    preloadData={true}
    href="/docs/shadcn-ui"
    className={cn(
      sidebarItemClasses.base,
      "justify-start space-x-3",
      String(pathname) === "/docs/shadcn-ui" && sidebarItemClasses.active,
    )}
  >
    <Shadcn size={14} />
    <p class="truncate">{i18n.t("common.nav.shadcn")}</p>
  </InternalLink>
{/if}
{#if globals.enableSubmit}
  <ExternalLink
    href={globals.submitUrl}
    className={cn(
      sidebarItemClasses.base,
      "flex justify-start space-x-3 md:hidden",
    )}
  >
    <Submit size={16} />
    <p class="truncate">{i18n.t("common.sidebar.submitSvg")}</p>
  </ExternalLink>
{/if}
{#if brand.showDeveloperTools}
  <ExternalLink
    href={globals.githubUrl}
    className={cn(
      sidebarItemClasses.base,
      "flex justify-start space-x-3 md:hidden",
    )}
  >
    <Github size={16} />
    <p class="truncate">{i18n.t("common.sidebar.githubRepo")}</p>
  </ExternalLink>
{/if}
