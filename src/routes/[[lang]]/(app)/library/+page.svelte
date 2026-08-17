<script lang="ts">
  import type { PageProps } from "./$types";
  import { browser } from "$app/environment";

  import { cn } from "@/utils/cn";
  import { svgsData, getPopularCategories } from "@/data";
  import { deleteParam } from "@/utils/searchParams";
  import { searchSvgsWithFuse } from "@/utils/searchWithFuse";

  import Grid from "@/components/grid.svelte";
  import Search from "@/components/search.svelte";
  import SvgCard from "@/components/svgs/svgCard.svelte";
  import SortSvgs from "@/components/svgs/sortSvgs.svelte";
  import Container from "@/components/container.svelte";
  import SvgPagination from "@/components/svgs/SvgPagination.svelte";

  import PageCard from "@/components/pageCard.svelte";
  import PageHeader from "@/components/pageHeader.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import SvgNotFound from "@/components/svgs/svgNotFound.svelte";
  import WarningMessage from "@/components/warningMessage.svelte";
  import { brand } from "@/brand";
  import { librarySeo } from "@/config/library-seo";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import Files from "@lucide/svelte/icons/files";
  import SearchXIcon from "@lucide/svelte/icons/search-x";
  import { getI18n } from "@/lib/i18n/context";

  let { data }: PageProps = $props();
  const i18n = $derived(getI18n());
  const libraryTitle = $derived(i18n.t("LibraryPage.h1") || librarySeo.h1);
  const libraryLead = $derived(i18n.t("LibraryPage.lead") || librarySeo.lead);
  const libraryDescription = $derived(
    i18n.t("LibraryPage.description") || librarySeo.description,
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
    const latest = data.latestSorted ?? [];
    const alphabetical = data.alphabeticallySorted ?? [];

    if (!searchTerm) {
      return isSorted ? alphabetical : latest;
    }
    const baseData = isSorted ? alphabetical : latest;
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
  const collectionJsonLdHtml =
    '<script type="application/ld+json">' +
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: libraryTitle,
      description: libraryDescription,
      url: `${brand.siteUrl}/library`,
      numberOfItems: svgsData.length,
    }) +
    scriptClose;
</script>

<svelte:head>
  {@html collectionJsonLdHtml}
</svelte:head>

<div class="space-y-1 px-0.5">
  <h1 class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {libraryTitle}
  </h1>
  <p class="text-sm text-neutral-500 dark:text-neutral-400">
    {libraryLead}
    <InternalLink href="/browse" className="ml-1 text-brand-energy dark:text-brand">
      {i18n.t("Ui.azIndex")}
    </InternalLink>
  </p>
</div>

<div class="mt-3 flex flex-wrap gap-2">
  {#each getPopularCategories(12) as cat (cat)}
    <InternalLink
      href={`/directory/${encodeURIComponent(cat.toLowerCase())}`}
      className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:border-brand hover:text-brand dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
    >
      {cat}
    </InternalLink>
  {/each}
</div>

<Search
  searchValue={searchTerm}
  onSearch={handleSearch}
/>

<PageCard
  containerClass="mt-2"
  contentCardClass="min-h-[60vh]"
>
  <PageHeader>
    <div
      class="flex items-center space-x-2 text-neutral-500 dark:text-neutral-400"
    >
      {#if !searchTerm}
        <Files size={18} strokeWidth={1.5} />
        <p>
          <span class="font-mono">{svgsData.length}</span>
          <span>{i18n.t("Ui.logos")}</span>
        </p>
      {:else}
        <Button
          title={i18n.t("Ui.clearSearch")}
          onclick={handleClearSearch}
          variant="ghost"
          size="icon"
        >
          <SearchXIcon size={18} strokeWidth={1.5} />
        </Button>
        <p>
          <span class="font-mono">{filteredSvgs.length}</span>
          <span>{i18n.t("Ui.logos")}</span>
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
  {#if browser}
    <WarningMessage />
  {/if}
  <Container className="my-6">
    <div class="sr-only">
      <section>
        <h2>{i18n.t("LibraryPage.sections.search.h2")}</h2>
        <p>{i18n.t("LibraryPage.sections.search.body")}</p>
        <h3>{i18n.t("LibraryPage.sections.search.h3")}</h3>
      </section>
      <section>
        <h2>{i18n.t("LibraryPage.sections.download.h2")}</h2>
        <p>{i18n.t("LibraryPage.sections.download.body")}</p>
        <h3>{i18n.t("LibraryPage.sections.download.h3")}</h3>
      </section>
    </div>
    <Grid>
      {#each displaySvgs as svg (svg.id)}
        <SvgCard svgInfo={svg} />
      {/each}
    </Grid>
    {#if filteredSvgs.length === 0}
      <SvgNotFound svgTitle={searchTerm} />
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
