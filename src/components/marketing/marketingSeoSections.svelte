<script lang="ts">
  import { homeSeoIntro, homeSeoBlocks, homeSeoFaq, homeSeoFaqSection } from "@/config/home-seo";
  import { getSvgsByTitles, getSvgImgUrl } from "@/data";
  import { cn } from "@/utils/cn";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { getSvgLibraryHref } from "@/utils/svgLinks";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { mode } from "mode-watcher";

  const isDark = $derived(mode.current === "dark");

  const blockVisuals = $derived(
    Object.fromEntries(
      homeSeoBlocks.map((block) => [
        block.id,
        block.visualBrands ? getSvgsByTitles(block.visualBrands) : [],
      ]),
    ),
  );
</script>

<section class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto max-w-3xl px-4 py-14 text-center md:py-16">
    <p
      class="inline-block rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
    >
      {homeSeoIntro.tag}
    </p>
    <h2
      class="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50"
    >
      {homeSeoIntro.title}
    </h2>
    <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
      {homeSeoIntro.description}
    </p>
  </div>
</section>

{#each homeSeoBlocks as block (block.id)}
  {@const visuals = blockVisuals[block.id] ?? []}
  <section
    class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div
      class={cn(
        "mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-16",
        block.reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      <div>
        <p
          class="inline-block rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
        >
          {block.tag}
        </p>
        <h2
          class="mt-4 text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-50"
        >
          {block.title}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
          {block.body}
        </p>
        <ul class="mt-5 space-y-2.5">
          {#each block.bullets as bullet (bullet)}
            <li class="flex gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
              <span
                class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                aria-hidden="true"
              ></span>
              {bullet}
            </li>
          {/each}
        </ul>
      </div>

      {#if visuals.length > 0}
        <div
          class="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50"
        >
          {#each visuals as svg (`${block.id}-${svg.id}`)}
            <InternalLink
              href={getSvgLibraryHref(svg)}
              title={svg.title}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-white p-3 transition-colors sm:p-4",
                "hover:border-brand/40 hover:bg-brand/5 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-brand/50",
              )}
            >
              <img
                src={getSvgImgUrl({ url: svg.route!, isDark })}
                alt={getSvgAltText(svg)}
                class="max-h-[58%] max-w-[72%] object-contain"
                loading="lazy"
                decoding="async"
              />
            </InternalLink>
          {/each}
        </div>
      {/if}
    </div>
  </section>
{/each}

<section
  class="w-full border-b border-neutral-200 bg-neutral-100 py-12 md:py-16 dark:border-neutral-800 dark:bg-neutral-900/50"
>
  <article class="mx-auto max-w-3xl px-4">
    <img
      src="/og-image.png"
      alt="5svg.com — modern SVG resources and tools"
      class="mx-auto block w-full max-w-lg object-contain"
      width="1200"
      height="630"
      loading="lazy"
      decoding="async"
    />

    <h2
      class="mt-10 text-center text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50"
    >
      {homeSeoFaqSection.title}
    </h2>
    <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {homeSeoFaqSection.subtitle}
    </p>
    <p
      class="mt-4 border-b border-neutral-200 pb-8 text-center text-sm leading-relaxed text-neutral-700 md:text-base dark:border-neutral-700 dark:text-neutral-300"
    >
      {homeSeoFaqSection.lead}
    </p>

    {#each homeSeoFaq as item, i (item.question)}
      <p
        class={cn(
          "text-sm leading-relaxed text-neutral-600 dark:text-neutral-400",
          i === 0 ? "pt-2" : "pt-6",
          i < homeSeoFaq.length - 1 &&
            "border-b border-neutral-200 pb-6 dark:border-neutral-700",
        )}
      >
        <strong class="block font-semibold text-neutral-900 dark:text-neutral-50">{item.question}</strong>
        <span class="mt-1.5 block">{item.answer}</span>
      </p>
    {/each}
  </article>
</section>
