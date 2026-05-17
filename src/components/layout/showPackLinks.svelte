<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "@/utils/cn";
  import { iconPacks } from "@/config/icon-packs";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { sidebarItemClasses } from "@/components/layout/sidebarItemClasses";
</script>

<h2
  class="mb-1 px-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
>
  Icon packs
</h2>
{#each iconPacks as pack (pack.id)}
  <InternalLink
    href={`/more/${pack.id}`}
    preloadData={true}
    className={cn(
      sidebarItemClasses.base,
      page.url.pathname === `/more/${pack.id}` && sidebarItemClasses.active,
      "pr-3",
    )}
  >
    <p class="truncate text-sm font-normal">{pack.name}</p>
  </InternalLink>
{/each}
