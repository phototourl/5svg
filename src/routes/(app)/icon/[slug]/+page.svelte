<script lang="ts">
  import type { PageProps } from "./$types";
  import { brand } from "@/brand";
  import { cn } from "@/utils/cn";
  import { mode } from "mode-watcher";
  import { getSvgImgUrl } from "@/data";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { getSvgSlug } from "@/utils/svg-slug";
  import { getCategoryHref } from "@/utils/svgLinks";
  import { getIconCategories } from "@/config/icon-detail-seo";

  import Container from "@/components/container.svelte";
  import SvgCard from "@/components/svgs/svgCard.svelte";
  import CopySvg from "@/components/svgs/copySvg.svelte";
  import DownloadSvg from "@/components/svgs/downloadSvg.svelte";
  import AddToFavorite from "@/components/svgs/addToFavorite.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ExternalLink from "@/components/ui/links/external-link.svelte";
  import { badgeVariants } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";

  import LinkIcon from "@lucide/svelte/icons/link";
  import SiteFreshness from "@/components/seo/site-freshness.svelte";
  import BaselineIcon from "@lucide/svelte/icons/baseline";
  import SparklesIcon from "@lucide/svelte/icons/sparkles";

  let { data }: PageProps = $props();

  const svg = $derived(data.svg);
  const seo = $derived(data.seo);
  const categories = $derived(getIconCategories(svg));
  const slug = $derived(getSvgSlug(svg) ?? "");
  const isDark = $derived(mode.current === "dark");

  let wordmarkView = $state(false);

  const previewUrl = $derived.by(() => {
    if (wordmarkView && svg.wordmark !== undefined) {
      return getSvgImgUrl({ url: svg.wordmark, isDark: isDark });
    }
    return getSvgImgUrl({ url: svg.route, isDark: isDark });
  });

  const scriptClose = "</" + "script>";
  const jsonLdHtml = $derived.by(() => {
    const canonical = `${brand.siteUrl}/icon/${encodeURIComponent(slug)}`;
    const imageUrl = `${brand.siteUrl}${previewUrl}`;
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": canonical,
          url: canonical,
          name: seo.title,
          description: seo.description,
          isPartOf: { "@id": `${brand.siteUrl}/#website` },
          primaryImageOfPage: { "@id": `${canonical}#image` },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: brand.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Library",
              item: `${brand.siteUrl}/library`,
            },
            ...(seo.primaryCategory
              ? [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: seo.primaryCategory,
                    item: `${brand.siteUrl}${seo.primaryCategoryHref}`,
                  },
                  {
                    "@type": "ListItem",
                    position: 4,
                    name: svg.title,
                    item: canonical,
                  },
                ]
              : [
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: svg.title,
                    item: canonical,
                  },
                ]),
          ],
        },
        {
          "@type": "ImageObject",
          "@id": `${canonical}#image`,
          name: `${svg.title} SVG logo`,
          contentUrl: imageUrl,
          description: seo.description,
          license: `${brand.siteUrl}/license`,
        },
      ],
    };
    return (
      '<script type="application/ld+json">' + JSON.stringify(graph) + scriptClose
    );
  });
</script>

<svelte:head>
  {@html jsonLdHtml}
</svelte:head>

<Container className="my-6 max-w-4xl">
  <div
    class={cn(
      "rounded-md border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900/40",
    )}
  >
    <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div class="min-w-0 flex-1">
        <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
          {seo.h1}
        </h1>
        <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {seo.lead}
        </p>
        <SiteFreshness className="mt-2 text-xs text-neutral-500" />
        <div class="mt-4 flex flex-wrap gap-2">
          {#each categories as category (category)}
            <InternalLink
              href={getCategoryHref(category)}
              className={badgeVariants({ variant: "outline", class: "font-mono text-xs" })}
            >
              {category}
            </InternalLink>
          {/each}
        </div>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        <AddToFavorite svg={svg} />
      </div>
    </div>

    <div
      class={cn(
        "mt-8 flex min-h-40 flex-col items-center justify-center rounded-md",
        "border border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 dark:border-neutral-700 dark:bg-neutral-950/50",
      )}
    >
      <img
        src={previewUrl}
        alt={getSvgAltText(svg, wordmarkView ? "wordmark" : "logo")}
        width="160"
        height="80"
        class="max-h-20 w-auto select-none"
        loading="eager"
        fetchpriority="high"
      />
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-2">
      <CopySvg
        size={16}
        iconStroke={1.8}
        svgInfo={svg}
        isInFigma={false}
        isWordmarkSvg={wordmarkView && svg.wordmark !== undefined}
      />
      <DownloadSvg svgInfo={svg} isDarkTheme={() => isDark} />
      <ExternalLink
        href={svg.url}
        title="Official website"
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium",
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        )}
      >
        <LinkIcon size={16} strokeWidth={1.8} />
        Website
      </ExternalLink>
      {#if svg.wordmark !== undefined}
        <Button
          variant="ghost"
          size="sm"
          title={wordmarkView ? "Show logo" : "Show wordmark"}
          onclick={() => {
            wordmarkView = !wordmarkView;
          }}
        >
          {#if wordmarkView}
            <SparklesIcon size={16} />
            Logo
          {:else}
            <BaselineIcon size={16} />
            Wordmark
          {/if}
        </Button>
      {/if}
    </div>

    <p class="mt-6 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
      {svg.title} is a trademark of its respective owner. 5SVG is not affiliated with or endorsed
      by the brand.
      <InternalLink href="/license" className="ml-1 text-brand-energy dark:text-brand">
        License & trademarks
      </InternalLink>
    </p>
  </div>

  {#if data.related.length > 0}
    <section class="mt-10">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        Related SVG logos
      </h2>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        More free vectors in {seo.primaryCategory}.
      </p>
      <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {#each data.related as related (related.id)}
          <SvgCard svgInfo={related} />
        {/each}
      </div>
    </section>
  {/if}

  <p class="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center text-sm">
    <InternalLink href="/library" className="font-medium text-brand-energy dark:text-brand">
      ← Library
    </InternalLink>
    <InternalLink href="/browse" className="font-medium text-brand-energy dark:text-brand">
      A–Z index
    </InternalLink>
  </p>
</Container>
