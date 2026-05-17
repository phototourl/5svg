<script lang="ts">
  import type { PageProps } from "./$types";
  import { getCategoryHref } from "@/utils/svgLinks";

  import Container from "@/components/container.svelte";
  import Grid from "@/components/grid.svelte";
  import SvgCard from "@/components/svgs/svgCard.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import SiteFreshness from "@/components/seo/site-freshness.svelte";

  let { data }: PageProps = $props();
</script>

<Container className="my-6">
  <header class="mb-6 max-w-3xl">
    <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
      {data.tag.h1}
    </h1>
    <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      {data.tag.lead}
    </p>
    <SiteFreshness className="mt-3 text-xs text-neutral-500" />
    <p class="mt-4 flex flex-wrap gap-3 text-sm">
      <InternalLink href="/library" className="text-brand-energy dark:text-brand">
        Full library
      </InternalLink>
      <InternalLink href="/browse" className="text-brand-energy dark:text-brand">
        A–Z index
      </InternalLink>
      {#if data.category}
        <InternalLink
          href={getCategoryHref(data.category)}
          className="text-brand-energy dark:text-brand"
        >
          {data.category} category
        </InternalLink>
      {/if}
    </p>
  </header>

  {#if data.svgs.length > 0}
    <p class="mb-4 text-sm text-neutral-500">
      Showing {data.svgs.length}{#if data.total > data.svgs.length}
        of {data.total}{/if} logos
    </p>
    <Grid>
      {#each data.svgs as svg (svg.id)}
        <SvgCard svgInfo={svg} />
      {/each}
    </Grid>
  {:else}
    <p class="text-sm text-neutral-600 dark:text-neutral-400">
      Browse the
      <InternalLink href="/library" className="text-brand-energy dark:text-brand">
        main library
      </InternalLink>
      or
      <InternalLink href="/browse" className="text-brand-energy dark:text-brand">
        A–Z index
      </InternalLink>
      for all brand SVGs.
    </p>
  {/if}
</Container>
