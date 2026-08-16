<script lang="ts">
  import type { iSVG } from "@/types/svg";

  import { searchSvgsWithFuse } from "@/utils/searchWithFuse";
  import { deleteParam, getParamValue } from "@/utils/searchParams";

  // Store:
  import favoritesStore from "@/stores/favorites.store";

  // Components:
  import { buttonVariants } from "@/components/ui/button";
  import { Button } from "@/components/ui/button";
  import PageCard from "@/components/pageCard.svelte";
  import PageHeader from "@/components/pageHeader.svelte";
  import Grid from "@/components/grid.svelte";
  import Container from "@/components/container.svelte";

  // Svgs:
  import Search from "@/components/search.svelte";
  import SvgCard from "@/components/svgs/svgCard.svelte";
  import SvgNotFound from "@/components/svgs/svgNotFound.svelte";
  import { favoritesSeo } from "@/config/favorites-seo";

  import SearchIcon from "@lucide/svelte/icons/search";
  import SearchXIcon from "@lucide/svelte/icons/search-x";
  import TrashIcon from "@lucide/svelte/icons/trash";
  import FolderHeart from "@lucide/svelte/icons/folder-heart";
  import { getI18n } from "@/lib/i18n/context";

  // States:
  let searchTerm = $state<string>(getParamValue("search") || "");
  const i18n = $derived(getI18n());

  let allFavorites = $derived($favoritesStore);
  let filteredFavorites = $state<Array<iSVG>>([]);
  let favoritesCount = $derived(favoritesStore.getCount(allFavorites));

  const searchFavorites = () => {
    if (!searchTerm) {
      filteredFavorites = allFavorites;
      return;
    }
    filteredFavorites = searchSvgsWithFuse(allFavorites)
      .search(searchTerm)
      .map((result) => result.item);
  };

  const handleSearch = (value: string) => {
    searchTerm = value;
    searchFavorites();
  };

  const handleClearSearch = () => {
    searchTerm = "";
    deleteParam("search");
    filteredFavorites = allFavorites;
  };

  const handleClearFavorites = () => {
    favoritesStore.clearFavorites();
  };

  $effect(() => {
    searchFavorites();
  });
</script>

<Search
  searchValue={searchTerm}
  onSearch={handleSearch}
/>

<PageCard containerClass="mt-2">
  <PageHeader>
    <div
      class="flex items-center space-x-2 font-medium text-neutral-950 dark:text-neutral-50"
    >
      {#if searchTerm}
        <Button
          title={i18n.t("Ui.clearSearch")}
          onclick={handleClearSearch}
          variant="ghost"
          size="icon"
        >
          <SearchXIcon size={18} strokeWidth={1.5} />
        </Button>
      {:else}
        <FolderHeart size={18} strokeWidth={1.5} />
      {/if}
      <p class="text-base font-medium">{i18n.t("FavoritesPage.title")}</p>
      {#if favoritesCount > 0}
        <span>-</span>
        {#if !searchTerm}
          <span>{favoritesCount} {i18n.t("Ui.svgs")}</span>
        {:else}
          <p>
            <span class="font-mono">{filteredFavorites.length}</span>
            <span>{i18n.t("Ui.searchResults")}</span>
          </p>
        {/if}
      {/if}
    </div>
    {#if favoritesCount > 0}
      <Button variant="ghost" onclick={handleClearFavorites}>
        <TrashIcon size={14} strokeWidth={1.5} />
        <span>{i18n.t("FavoritesPage.clearAll")}</span>
      </Button>
    {/if}
  </PageHeader>
  <Container className="my-6">
    <div class="sr-only">
      <h1>{favoritesSeo.h1}</h1>
      <p>{favoritesSeo.lead}</p>
      <section>
        <h2>{favoritesSeo.sections.manage.h2}</h2>
        <p>{favoritesSeo.sections.manage.body}</p>
        <h3>{favoritesSeo.sections.manage.h3}</h3>
      </section>
      <section>
        <h2>{favoritesSeo.sections.browse.h2}</h2>
        <p>{favoritesSeo.sections.browse.body}</p>
        <h3>{favoritesSeo.sections.browse.h3}</h3>
      </section>
    </div>
    <Grid>
      {#each filteredFavorites as svg (svg.id)}
        <SvgCard svgInfo={svg} />
      {/each}
    </Grid>
    {#if filteredFavorites.length === 0 && searchTerm}
      <SvgNotFound svgTitle={searchTerm} searchGlobally={true} />
    {/if}
    {#if filteredFavorites.length === 0 && !searchTerm && favoritesCount === 0}
      <div
        class="flex w-full flex-col items-center justify-center space-y-4 py-6"
      >
        <FolderHeart size={48} strokeWidth={1} />
        <h2 class="text-xl font-semibold">{i18n.t("FavoritesPage.emptyTitle")}</h2>
        <p class="text-center text-neutral-600 dark:text-neutral-400">
          {i18n.t("FavoritesPage.emptyBody")}
        </p>
        <a href="/library" class={buttonVariants({ variant: "outline" })}>
          <SearchIcon size={14} strokeWidth={1.5} />
          <span>{i18n.t("FavoritesPage.browseSvgs")}</span>
        </a>
      </div>
    {/if}
  </Container>
</PageCard>
