<script lang="ts">
  import { brand } from "@/brand";
  import { siteSeo } from "@/config/seo";
  import { homeSeoMeta } from "@/config/home-seo";
  import {
    svgsData,
    getSvgImgUrl,
    sampleSvgs,
    getCategoryStats,
  } from "@/data";
  import MarketingLogoMarquee from "@/components/marketing/marketingLogoMarquee.svelte";
  import MarketingHeroShowcase from "@/components/marketing/marketingHeroShowcase.svelte";
  import MarketingSeoSections from "@/components/marketing/marketingSeoSections.svelte";
  import MarketingHowItWorks from "@/components/marketing/marketingHowItWorks.svelte";

  import Truck from "@lucide/svelte/icons/truck";
  import BadgePercent from "@lucide/svelte/icons/badge-percent";
  import Headphones from "@lucide/svelte/icons/headphones";
  import FolderOpen from "@lucide/svelte/icons/folder-open";
  import { mode } from "mode-watcher";
  import { getSvgAltText } from "@/utils/svgAlt";

  const valueProps = [
    {
      icon: Truck,
      title: "Free to browse",
      description:
        "Open the library anytime — search, filter by category, and download SVG files with no signup.",
    },
    {
      icon: BadgePercent,
      title: "Curated collection",
      description:
        "Hundreds of brand logos and icons in one place — ready for crafts, design, and print.",
    },
    {
      icon: Headphones,
      title: "Easy to use",
      description:
        "One-click download, save favorites, and use SVGs in Cricut, Silhouette, Canva, or any design app.",
    },
  ] as const;

  const craftUses = [
    { icon: "/marketing/craft/scissors.svg", label: "Cutting crafts" },
    { icon: "/marketing/craft/sparkles.svg", label: "Stickers & decals" },
    { icon: "/marketing/craft/gift.svg", label: "Gifts & party" },
    { icon: "/marketing/craft/tag.svg", label: "Labels & tags" },
    { icon: "/marketing/craft/photo.svg", label: "Print & photo" },
    { icon: "/marketing/craft/heart.svg", label: "Personal projects" },
  ] as const;

  const marqueeRowA = sampleSvgs(20, 0);
  const marqueeRowB = sampleSvgs(20, 11);
  const categoryStats = getCategoryStats(6);
  const categoryIconDark = $derived(mode.current === "dark");
</script>

<svelte:head>
  <title>{siteSeo.title}</title>
  <meta name="description" content={siteSeo.description} />
  <meta name="keywords" content={homeSeoMeta.keywords} />
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSeo.siteName,
    url: siteSeo.url,
    description: siteSeo.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${brand.siteUrl}/library?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  })}</script>`}
</svelte:head>

<!-- Hero -->
<section class="bg-white dark:bg-neutral-950">
  <div
    class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16"
  >
    <div>
      <h1
        class="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl dark:text-neutral-50"
      >
        Free SVG files &amp; vector graphics for crafts and design
      </h1>
      <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        {brand.tagline}
      </p>
      <img
        src="/og-image.png"
        alt="5svg.com — modern SVG resources and tools"
        class="mt-8 w-full max-w-md object-contain"
        width="1200"
        height="630"
        loading="lazy"
        decoding="async"
      />
    </div>

    <MarketingHeroShowcase />
  </div>
</section>

<!-- Scrolling logo strip (8svg-style density) -->
<section
  class="space-y-3 border-y border-neutral-200 bg-neutral-50 py-6 dark:border-neutral-800 dark:bg-neutral-900/50"
  aria-label="Browse logos from the library"
>
  <MarketingLogoMarquee items={marqueeRowA} duration="50s" />
  <MarketingLogoMarquee items={marqueeRowB} reverse duration="55s" />
</section>

<!-- Value highlights -->
<section class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:py-14">
    {#each valueProps as item (item.title)}
      {@const Icon = item.icon}
      <div class="text-center">
        <div
          class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
        >
          <Icon size={22} strokeWidth={1.5} class="text-brand" />
        </div>
        <h2
          class="text-base font-semibold uppercase tracking-wide text-neutral-900 dark:text-neutral-50"
        >
          {item.title}
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {item.description}
        </p>
      </div>
    {/each}
  </div>
</section>

<MarketingSeoSections />

<!-- Perfect for crafts -->
<section class="mx-auto max-w-6xl px-4 py-12 md:py-14">
  <h2
    class="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
  >
    Made for everyday makers
  </h2>
  <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
    Logos and icons you can use in Cricut, Silhouette, Canva, shirts, stickers, and more.
  </p>
  <div class="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
    {#each craftUses as item (item.label)}
      <div
        class="flex flex-col items-center rounded-xl border border-neutral-200 bg-white px-4 py-6 text-center dark:border-neutral-800 dark:bg-neutral-900"
      >
        <img
          src={item.icon}
          alt={`${item.label} craft icon`}
          class="size-10 text-neutral-900 dark:invert"
          loading="lazy"
        />
        <p class="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {item.label}
        </p>
      </div>
    {/each}
  </div>
</section>

<MarketingHowItWorks />

<!-- Library overview (informational) -->
<section class="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto max-w-6xl px-4 py-12 md:py-14">
    <h2
      class="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
    >
      What’s in the library
    </h2>
    <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {svgsData.length}+ SVG files grouped by topic — use the header menu when you’re ready to browse or
      download.
    </p>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each categoryStats as cat (cat.name)}
        <li
          class="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div
            class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-950"
          >
            {#if cat.preview?.route}
              <img
                src={getSvgImgUrl({ url: cat.preview.route, isDark: categoryIconDark })}
                alt={getSvgAltText(cat.preview)}
                class="max-h-full max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            {:else}
              <FolderOpen
                size={20}
                strokeWidth={1.75}
                class="text-neutral-400 dark:text-neutral-500"
                aria-hidden="true"
              />
            {/if}
          </div>
          <div class="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span
              class="font-medium capitalize text-neutral-900 dark:text-neutral-50"
            >
              {cat.name}
            </span>
            <span class="shrink-0 text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
              {cat.count} SVG{cat.count === 1 ? "" : "s"}
            </span>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
