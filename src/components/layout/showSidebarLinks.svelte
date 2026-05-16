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

  import Box from "@lucide/svelte/icons/box";
  import House from "@lucide/svelte/icons/house";
  import Heart from "@lucide/svelte/icons/heart";
  import Cloud from "@lucide/svelte/icons/cloud";
  import Submit from "@lucide/svelte/icons/send";

  import Github from "@/components/logos/github.svelte";
  import Shadcn from "@/components/logos/shadcn.svelte";

  let favorites = $derived($favoritesStore);
  let favoritesCount = $derived(favoritesStore.getCount(favorites));
</script>

<InternalLink
  href="/library"
  preloadData={true}
  className={cn(
    sidebarItemClasses.base,
    "justify-start space-x-3",
    (page.url.pathname === "/library" ||
      page.url.pathname.startsWith("/directory")) &&
      sidebarItemClasses.active,
  )}
>
  <House size={16} />
  <p class="truncate">Free SVG</p>
</InternalLink>
<InternalLink
  href="/favorites"
  preloadData={true}
  className={cn(
    sidebarItemClasses.base,
    "justify-between",
    String(page.url.pathname) === "/favorites" && sidebarItemClasses.active,
  )}
>
  <div class="flex items-center space-x-3">
    <Heart size={16} />
    <p class="truncate">Favorites</p>
  </div>
  {#if favoritesCount > 0}
    <span
      class={cn(sidebarBadgeClasses, page.url.pathname && "border-transparent")}
    >
      {favoritesCount}
    </span>
  {/if}
</InternalLink>
{#if brand.showApiNav}
  <InternalLink
    preloadData={true}
    href="/docs/api"
    className={cn(
      sidebarItemClasses.base,
      "justify-start space-x-3",
      (page.url.pathname === "/docs/api" ||
        page.url.pathname.startsWith("/docs/api/")) &&
        sidebarItemClasses.active,
    )}
  >
    <Cloud size={16} />
    <p class="truncate">API</p>
  </InternalLink>
{/if}
{#if brand.showDeveloperTools}
  <InternalLink
    preloadData={true}
    href="/docs/shadcn-ui"
    className={cn(
      sidebarItemClasses.base,
      "justify-start space-x-3",
      String(page.url.pathname) === "/docs/shadcn-ui" &&
        sidebarItemClasses.active,
    )}
  >
    <Shadcn size={14} />
    <p class="truncate">shadcn/ui</p>
  </InternalLink>
  <InternalLink
    preloadData={true}
    href="/extensions"
    className={cn(
      sidebarItemClasses.base,
      "justify-start space-x-3",
      String(page.url.pathname) === "/extensions" && sidebarItemClasses.active,
    )}
  >
    <Box size={16} />
    <p class="truncate">Extensions</p>
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
    <p class="truncate">Submit SVG</p>
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
    <p class="truncate">GitHub Repository</p>
  </ExternalLink>
{/if}
