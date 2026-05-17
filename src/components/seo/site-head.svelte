<script lang="ts">
  import { page } from "$app/state";
  import { siteSeo } from "@/config/seo";
  import { resolvePageSeo } from "@/utils/page-seo";

  const pageSeo = $derived(
    resolvePageSeo(page.url.pathname, page.data as Record<string, unknown>),
  );

  const ogImage = $derived(pageSeo.ogImage ?? siteSeo.ogImage);
  const ogImageAlt = $derived(pageSeo.ogImageAlt ?? siteSeo.ogImageAlt);
  const twitterCard = $derived(pageSeo.twitterCard ?? siteSeo.twitterCard);
  const useDefaultOgDimensions = $derived(
    pageSeo.ogImageWidth == null || pageSeo.ogImageHeight == null,
  );
</script>

<svelte:head>
  <title>{pageSeo.title}</title>
  <meta name="description" content={pageSeo.description} />
  <meta name="author" content={siteSeo.siteName} />
  <meta name="robots" content={pageSeo.robots} />
  <link rel="canonical" href={pageSeo.canonical} />

  <link rel="icon" type="image/png" href={siteSeo.favicon} sizes="96x96" />
  <link rel="shortcut icon" href={siteSeo.favicon} />
  <link rel="apple-touch-icon" href={siteSeo.appleTouchIcon} />
  <link rel="manifest" href="/manifest.json" />

  <meta property="og:type" content={siteSeo.ogType} />
  <meta property="og:title" content={pageSeo.title} />
  <meta property="og:description" content={pageSeo.description} />
  <meta property="og:url" content={pageSeo.canonical} />
  <meta property="og:site_name" content={siteSeo.siteName} />
  <meta property="og:image" content={ogImage} />
  {#if useDefaultOgDimensions}
    <meta property="og:image:width" content={String(siteSeo.ogImageWidth)} />
    <meta property="og:image:height" content={String(siteSeo.ogImageHeight)} />
  {:else if pageSeo.ogImageWidth && pageSeo.ogImageHeight}
    <meta property="og:image:width" content={String(pageSeo.ogImageWidth)} />
    <meta property="og:image:height" content={String(pageSeo.ogImageHeight)} />
  {/if}
  <meta property="og:image:alt" content={ogImageAlt} />

  <meta name="twitter:card" content={twitterCard} />
  <meta name="twitter:title" content={pageSeo.title} />
  <meta name="twitter:description" content={pageSeo.description} />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:image:alt" content={ogImageAlt} />
</svelte:head>
