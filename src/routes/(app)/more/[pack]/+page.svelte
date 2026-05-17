<script lang="ts">
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";

  import { cn } from "@/utils/cn";
  import { deleteParam } from "@/utils/searchParams";
  import { searchPackIconsWithFuse } from "@/utils/searchPackWithFuse";

  import Grid from "@/components/grid.svelte";
  import Search from "@/components/search.svelte";
  import Container from "@/components/container.svelte";
  import PageCard from "@/components/pageCard.svelte";
  import PageHeader from "@/components/pageHeader.svelte";
  import PackIconCard from "@/components/svgs/packIconCard.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import SvgNotFound from "@/components/svgs/svgNotFound.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getPackPageSeo } from "@/config/pack-page-seo";
  import { getPackIconDetailHref } from "@/utils/pack-icon-paths";

  import Files from "@lucide/svelte/icons/files";
  import SearchXIcon from "@lucide/svelte/icons/search-x";

  let { data }: PageProps = $props();

  const packSeo = $derived(getPackPageSeo(data.pack, data.index.count));

  const INITIAL_DISPLAY = 40;
  const INCREMENT = 20;

  let maxDisplay = $state(INITIAL_DISPLAY);
  let searchOverride = $state<string | null>(null);
  let sentinel = $state<HTMLDivElement | null>(null);

  const searchTerm = $derived(searchOverride ?? "");

  const filteredIcons = $derived.by(() => {
    if (!searchTerm) return data.index.items;
    return searchPackIconsWithFuse(data.index.items)
      .search(searchTerm)
      .map((result) => result.item);
  });

  const displayIcons = $derived(filteredIcons.slice(0, maxDisplay));

  const handleSearch = (value: string) => {
    searchOverride = value;
    maxDisplay = INITIAL_DISPLAY;
  };

  const handleClearSearch = () => {
    searchOverride = "";
    maxDisplay = INITIAL_DISPLAY;
    deleteParam("search");
  };

  function getScrollParent(node: HTMLElement | null): HTMLElement | null {
    if (!node) return null;
    const { overflow, overflowY } = getComputedStyle(node);
    if (
      overflow.includes("scroll") ||
      overflow.includes("auto") ||
      overflowY.includes("scroll") ||
      overflowY.includes("auto")
    ) {
      return node;
    }
    return getScrollParent(node.parentElement);
  }

  $effect(() => {
    if (!sentinel) return;
    const root = getScrollParent(sentinel.parentElement);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && maxDisplay < filteredIcons.length) {
          maxDisplay += INCREMENT;
        }
      },
      { root, rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  });
</script>

<div class="space-y-1 px-0.5">
  <h1 class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {packSeo.h1}
  </h1>
  <p class="text-sm text-neutral-500 dark:text-neutral-400">
    {packSeo.lead}
    <InternalLink href="/browse" className="ml-1 text-brand-energy dark:text-brand">
      Brand logo index
    </InternalLink>
  </p>
</div>

<Search searchValue={searchTerm} onSearch={handleSearch} placeholder="Search in pack..." />

<PageCard
  containerClass="mt-2"
  contentCardClass="max-h-[calc(100vh-7.6rem)] min-h-[calc(100vh-7.6rem)]"
>
  <PageHeader>
    <div
      class="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400"
    >
      {#if !searchTerm}
        <Files size={18} strokeWidth={1.5} />
        <p>
          <span class="font-mono">{data.index.count}</span>
          <span>icons</span>
          <span class="text-neutral-400"> · {data.pack.name}</span>
        </p>
      {:else}
        <Button
          title="Clear Search"
          onclick={handleClearSearch}
          variant="ghost"
          size="icon"
        >
          <SearchXIcon size={18} strokeWidth={1.5} />
        </Button>
        <p>
          <span class="font-mono">{filteredIcons.length}</span>
          <span>matches</span>
        </p>
      {/if}
    </div>
  </PageHeader>

  <Container className="my-6">
    {#if !searchTerm && data.featured.length > 0}
      <section class="mb-6 rounded-md border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 class="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
          {packSeo.featuredHeading}
        </h2>
        <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {packSeo.featuredNote}
        </p>
        <ul class="mt-3 flex flex-wrap gap-2">
          {#each data.featured as icon (icon.id)}
            <li>
              <InternalLink
                href={getPackIconDetailHref(data.pack.id, icon.id)}
                className={cn(
                  "rounded border border-neutral-200 px-2 py-1 text-xs",
                  "hover:border-brand-energy/40 dark:border-neutral-700",
                )}
              >
                {icon.title}
              </InternalLink>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
    <Grid>
      {#each displayIcons as icon (icon.id)}
        <PackIconCard {icon} />
      {/each}
    </Grid>
    <div bind:this={sentinel} class="h-1"></div>
    {#if browser && filteredIcons.length === 0}
      <SvgNotFound svgTitle={searchTerm} />
    {/if}
  </Container>
</PageCard>
