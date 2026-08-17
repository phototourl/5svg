<script lang="ts">
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";

  import { cn } from "@/utils/cn";
  import { deleteParam } from "@/utils/searchParams";
  import { searchSvgsWithFuse } from "@/utils/searchWithFuse";

  import Grid from "@/components/grid.svelte";
  import Search from "@/components/search.svelte";
  import PageCard from "@/components/pageCard.svelte";
  import SvgCard from "@/components/svgs/svgCard.svelte";
  import Container from "@/components/container.svelte";
  import PageHeader from "@/components/pageHeader.svelte";
  import SortSvgs from "@/components/svgs/sortSvgs.svelte";
  import SvgNotFound from "@/components/svgs/svgNotFound.svelte";
  import SvgPagination from "@/components/svgs/SvgPagination.svelte";
  import { Button, buttonVariants } from "@/components/ui/button";

  import SearchXIcon from "@lucide/svelte/icons/search-x";
  import FolderIcon from "@lucide/svelte/icons/folder-open";
  import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";

  import { brand } from "@/brand";
  import { getDirectorySeo } from "@/config/directory-seo";
  import { getI18n } from "@/lib/i18n/context";

  let { data }: PageProps = $props();

  const i18n = $derived(getI18n());

  const directorySeo = $derived(
    getDirectorySeo(data.category, data.initialSvgs.length),
  );

  const DEFAULT_PAGE_SIZE = 50;

  let pageSize = $state(DEFAULT_PAGE_SIZE);
  let currentPage = $state(1);
  let sortOverride = $state<boolean | null>(null);
  let searchOverride = $state<string | null>(null);

  const isSorted = $derived(sortOverride !== null ? sortOverride : data.sorted);
  const searchTerm = $derived(
    searchOverride !== null ? searchOverride : data.searchTerm,
  );

  const filteredSvgs = $derived.by(() => {
    if (!searchTerm) {
      return isSorted ? data.alphabeticallySorted : data.latestSorted;
    }
    const baseData = isSorted ? data.alphabeticallySorted : data.latestSorted;
    return searchSvgsWithFuse(baseData)
      .search(searchTerm)
      .map((result) => result.item);
  });

  const totalPages = $derived(
    Math.max(1, Math.ceil(filteredSvgs.length / pageSize)),
  );
  const safePage = $derived(Math.min(currentPage, totalPages));

  const displaySvgs = $derived.by(() => {
    const start = (safePage - 1) * pageSize;
    return filteredSvgs.slice(start, start + pageSize);
  });

  function resetPage() {
    currentPage = 1;
  }

  const handleSearch = (value: string) => {
    searchOverride = value;
    resetPage();
  };

  const handleClearSearch = () => {
    searchOverride = "";
    resetPage();
    deleteParam("search");
  };

  function scrollToGridTop() {
    if (!browser) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const scriptClose = "</" + "script>";
  const collectionJsonLdHtml = $derived.by(() => {
    const categoryPath = `/directory/${data.category.toLowerCase()}`;
    return (
      '<script type="application/ld+json">' +
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: directorySeo.headerH1,
        description: directorySeo.description,
        url: `${brand.siteUrl}${categoryPath}`,
        numberOfItems: data.initialSvgs.length,
      }) +
      scriptClose
    );
  });
</script>

<svelte:head>
  {@html collectionJsonLdHtml}
</svelte:head>

<div class="space-y-1 px-0.5">
  <h1 class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {directorySeo.headerH1}
  </h1>
  <p class="text-sm text-neutral-500 dark:text-neutral-400">
    {directorySeo.subtitle}
  </p>
</div>

<div class="sr-only">
  {#each directorySeo.sections as section (section.h2)}
    <section>
      <h2>{section.h2}</h2>
      <h3>{section.h3}</h3>
    </section>
  {/each}
</div>

<Search
  searchValue={searchTerm}
  onSearch={handleSearch}
  placeholder={`Search free ${data.category} SVG icons...`}
/>

<PageCard containerClass="mt-2">
  <PageHeader>
    <div
      class="flex items-center space-x-2 font-medium text-neutral-950 dark:text-neutral-50"
    >
      <a
        href="/library"
        class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        <ArrowLeftIcon size={18} strokeWidth={1.5} />
      </a>
      {#if searchTerm}
        <Button
          title="Clear Search"
          onclick={handleClearSearch}
          variant="ghost"
          size="icon"
        >
          <SearchXIcon size={18} strokeWidth={1.5} />
        </Button>
      {:else}
        <FolderIcon class="ml-1" size={18} strokeWidth={1.5} />
      {/if}
      <p class="text-base font-medium">{data.category}</p>
      <span aria-hidden="true">·</span>
      {#if !searchTerm}
        <p>
          <span class="font-mono">{data.initialSvgs.length}</span>
          <span>SVG logos</span>
        </p>
      {:else}
        <p>
          <span class="font-mono">{filteredSvgs.length}</span>
          <span>search results</span>
        </p>
      {/if}
    </div>
    <div class="flex items-center space-x-2">
      <SortSvgs
        className={cn(filteredSvgs.length === 0 && "hidden")}
        {isSorted}
        onSortedChange={(value) => {
          sortOverride = value;
          resetPage();
        }}
      />
    </div>
  </PageHeader>
  <Container className="my-6">
    <div class="mb-3 space-y-0.5">
      {#each directorySeo.sections as section (section.h3)}
        <h3 class="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {section.h3}
        </h3>
      {/each}
    </div>
    <Grid>
      {#each displaySvgs as svg (svg.id)}
        <SvgCard svgInfo={svg} />
      {/each}
    </Grid>
    {#if filteredSvgs.length === 0}
      <SvgNotFound svgTitle={searchTerm} category={data.category} />
    {:else}
      <SvgPagination
        total={filteredSvgs.length}
        page={safePage}
        {pageSize}
        onPageChange={(p) => {
          currentPage = p;
          scrollToGridTop();
        }}
        onPageSizeChange={(size) => {
          pageSize = size;
          resetPage();
          scrollToGridTop();
        }}
      />
    {/if}
  </Container>
</PageCard>
