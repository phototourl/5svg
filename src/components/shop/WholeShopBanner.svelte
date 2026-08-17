<script lang="ts">
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { formatUsd } from "@/lib/shop";
  import { getI18n } from "@/lib/i18n/context";

  interface Props {
    slug: string;
    priceCents: number;
    compareAtCents?: number;
    fileCount: number;
    previewPath: string;
  }

  let { slug, priceCents, compareAtCents, fileCount, previewPath }: Props =
    $props();

  const i18n = $derived(getI18n());
</script>

<section class="mt-10" aria-labelledby="shop-whole-heading">
  <h2
    id="shop-whole-heading"
    class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
  >
    {i18n.t("shop.wholeShopTitle")}
  </h2>
  <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
    {i18n.t("shop.wholeShopLead", { count: fileCount })}
  </p>
  <InternalLink
    href={`/shop/${slug}`}
    className="mt-5 flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-brand/40 bg-white no-underline shadow-sm transition hover:border-brand hover:shadow-md sm:flex-row sm:items-stretch dark:border-brand/50 dark:bg-neutral-950"
  >
    <div
      class="relative w-full shrink-0 bg-neutral-100 sm:w-[40%] md:w-[36%] dark:bg-neutral-100"
    >
      <img
        src={previewPath}
        alt=""
        class="block h-auto w-full object-contain object-center sm:h-full sm:min-h-[7.5rem] sm:object-cover"
      />
    </div>
    <div
      class="flex min-w-0 flex-1 flex-col justify-center gap-2 border-t border-brand/20 bg-brand/5 px-4 py-4 sm:border-t-0 sm:border-l sm:px-5 dark:border-brand/40 dark:bg-brand/10"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
        {i18n.t("shop.wholeShopBadge")}
      </p>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span class="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-neutral-50">
          {formatUsd(priceCents)}
        </span>
        {#if compareAtCents && compareAtCents > priceCents}
          <span class="text-sm text-neutral-400 line-through">
            {formatUsd(compareAtCents)}
          </span>
        {/if}
        <span
          class="ml-auto rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground sm:px-4"
        >
          {i18n.t("shop.wholeShopCta")}
        </span>
      </div>
    </div>
  </InternalLink>
</section>
