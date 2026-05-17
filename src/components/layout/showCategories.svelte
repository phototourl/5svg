<script lang="ts">
  import type { Category } from "@/types/categories";
  import { page } from "$app/state";

  import { cn } from "@/utils/cn";
  import { getCategories, getIndexableIconSlugs } from "@/data";
  import { svgs } from "@/data/svgs";

  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { sidebarItemClasses } from "@/components/layout/sidebarItemClasses";
  import { sidebarBadgeClasses } from "@/components/layout/sidebarBadgeClasses";

  // Get category counts:
  const categories: Category[] = getCategories();
  const logoIndexCount = getIndexableIconSlugs().length;
  let categoryCounts: Record<string, number> = {};
  categories.forEach((category) => {
    categoryCounts[category] = svgs.filter((svg) =>
      svg.category.includes(category),
    ).length;
  });
</script>

<h2
  class="mb-1 px-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
>
  Categories
</h2>
<InternalLink
  href="/browse"
  preloadData={true}
  className={cn(
    sidebarItemClasses.base,
    (page.url.pathname === "/browse" || page.url.pathname.startsWith("/tags")) &&
      sidebarItemClasses.active,
    "pr-3",
  )}
>
  <h3 class="truncate text-sm font-normal">All logos A–Z</h3>
  <span
    class={cn(sidebarBadgeClasses, page.url.pathname && "border-transparent")}
  >
    {logoIndexCount}
  </span>
</InternalLink>
{#each categories.sort() as category (category)}
  <InternalLink
    href={`/directory/${category.toLowerCase()}`}
    preloadData={true}
    className={cn(
      sidebarItemClasses.base,
      page.url.pathname === `/directory/${category.toLowerCase()}` &&
        sidebarItemClasses.active,
      "pr-3",
    )}
  >
    <h3 class="truncate text-sm font-normal">{category}</h3>
    <span
      class={cn(sidebarBadgeClasses, page.url.pathname && "border-transparent")}
    >
      {categoryCounts[category]}
    </span>
  </InternalLink>
{/each}
