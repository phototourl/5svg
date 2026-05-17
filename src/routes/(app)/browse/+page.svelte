<script lang="ts">
  import type { PageProps } from "./$types";
  import { brand } from "@/brand";
  import { browseSeo } from "@/config/browse-seo";
  import { getIconHref } from "@/utils/svg-slug";
  import { getCategoryHref } from "@/utils/svgLinks";

  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import SiteFreshness from "@/components/seo/site-freshness.svelte";
  import { cn } from "@/utils/cn";

  let { data }: PageProps = $props();

  const scriptClose = "</" + "script>";
  const itemListJsonLdHtml = $derived.by(() => {
    const icons = data.byLetter.flatMap((group) => group.icons).slice(0, 100);
    return (
      '<script type="application/ld+json">' +
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: browseSeo.h1,
        description: browseSeo.description,
        url: `${brand.siteUrl}/browse`,
        numberOfItems: data.total,
        itemListElement: icons.map((icon, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: icon.title,
          url: `${brand.siteUrl}${icon.href}`,
        })),
      }) +
      scriptClose
    );
  });
</script>

<svelte:head>
  {@html itemListJsonLdHtml}
</svelte:head>

<Container className="my-8 max-w-5xl">
  <header class="mb-8">
    <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
      {browseSeo.h1}
    </h1>
    <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      {browseSeo.lead}
      <span class="font-mono text-neutral-500"> ({data.total} logos)</span>
    </p>
    <SiteFreshness className="mt-2 text-xs text-neutral-500" />
    <p class="mt-4 text-sm">
      <InternalLink href="/library" className="font-medium text-brand-energy dark:text-brand">
        ← Interactive library
      </InternalLink>
    </p>
  </header>

  <section class="mb-10">
    <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
      Popular brands
    </h2>
    <ul class="mt-3 flex flex-wrap gap-2">
      {#each data.popular as svg (svg.id)}
        <li>
          <InternalLink
            href={getIconHref(svg)}
            className={cn(
              "rounded-md border border-neutral-200 px-3 py-1.5 text-sm",
              "hover:border-brand-energy/40 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50",
            )}
          >
            {svg.title}
          </InternalLink>
        </li>
      {/each}
    </ul>
  </section>

  <section class="mb-10">
    <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
      Categories
    </h2>
    <ul class="mt-3 flex flex-wrap gap-2">
      {#each data.categories as cat (cat.name)}
        <li>
          <InternalLink
            href={getCategoryHref(cat.name)}
            className={cn(
              "rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-mono",
              "hover:border-brand-energy/40 dark:border-neutral-800",
            )}
          >
            {cat.name}
            <span class="ml-1 text-neutral-400">({cat.count})</span>
          </InternalLink>
        </li>
      {/each}
    </ul>
  </section>

  <nav class="space-y-10" aria-label="Alphabetical logo index">
    {#each data.byLetter as group (group.letter)}
      <section id={`letter-${group.letter}`}>
        <h2
          class="sticky top-0 z-10 border-b border-neutral-200 bg-neutral-100/95 py-2 text-lg font-semibold text-neutral-900 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95 dark:text-neutral-50"
        >
          {group.letter}
        </h2>
        <ul
          class="mt-3 columns-1 gap-x-8 sm:columns-2 md:columns-3"
          aria-label={`Logos starting with ${group.letter}`}
        >
          {#each group.icons as icon (icon.slug)}
            <li class="mb-1.5 break-inside-avoid">
              <InternalLink
                href={icon.href}
                className="text-sm text-neutral-700 hover:text-brand-energy dark:text-neutral-300 dark:hover:text-brand"
              >
                {icon.title}
              </InternalLink>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </nav>
</Container>
