<script lang="ts">
  import { svgsData, getCategoryStats } from "@/data";
  import ThemeSvgImg from "@/components/svgs/theme-svg-img.svelte";
  import FolderOpen from "@lucide/svelte/icons/folder-open";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { getCategoryHref } from "@/utils/svgLinks";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());
  const categoryStats = getCategoryStats(6);
</script>

<section class="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto max-w-6xl px-4 py-12 md:py-14">
    <h2
      class="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
    >
      {i18n.t("home.library.title")}
    </h2>
    <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {i18n.t("home.library.subtitle", { count: svgsData.length })}
    </p>
    <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each categoryStats as cat (cat.name)}
        <li>
          <InternalLink
            href={getCategoryHref(cat.name)}
            title={i18n.t("home.library.browseTitle", { name: cat.name })}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 transition-colors hover:border-brand/40 hover:bg-brand/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand/50"
          >
            <div
              class="flex size-11 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white p-1.5 dark:border-neutral-700 dark:bg-neutral-950"
            >
              {#if cat.preview?.route}
                <ThemeSvgImg
                  route={cat.preview.route}
                  alt={getSvgAltText(cat.preview)}
                  class="max-h-full max-w-full object-contain"
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
                {cat.count === 1
                  ? i18n.t("home.library.svgCount", { count: cat.count })
                  : i18n.t("home.library.svgCountPlural", { count: cat.count })}
              </span>
            </div>
          </InternalLink>
        </li>
      {/each}
    </ul>
  </div>
</section>
