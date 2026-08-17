<script lang="ts">
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { formatUsd } from "@/lib/shop";
  import { getI18n } from "@/lib/i18n/context";

  interface Props {
    slug: string;
    title: string;
    description?: string;
    category?: string;
    priceCents: number;
    compareAtCents?: number;
    fileCount: number;
    previewPath: string;
    /** Compact home strip vs full shop grid card */
    variant?: "shop" | "home";
  }

  let {
    slug,
    title,
    description,
    category,
    priceCents,
    compareAtCents,
    fileCount,
    previewPath,
    variant = "shop",
  }: Props = $props();

  const i18n = $derived(getI18n());
  const isHome = $derived(variant === "home");
</script>

<InternalLink
  href={`/shop/${slug}`}
  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline shadow-sm transition-shadow hover:border-brand/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand/50"
>
  <div
    class="flex items-center justify-center overflow-hidden bg-neutral-100 p-4 dark:bg-neutral-100 {isHome
      ? 'h-40'
      : 'h-44'}"
  >
    <img
      src={previewPath}
      alt={title}
      class="h-full w-full object-contain object-center transition-transform group-hover:scale-[1.02]"
      loading={isHome ? "lazy" : undefined}
    />
  </div>
  {#if isHome}
    <div class="flex flex-1 flex-col gap-1 px-4 py-4">
      <p class="font-medium text-neutral-900 dark:text-neutral-50">{title}</p>
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        {i18n.t("shop.fileCount", { count: fileCount })}
      </p>
      <p class="mt-auto pt-2 text-base font-semibold text-brand-energy dark:text-brand">
        {formatUsd(priceCents)}
      </p>
    </div>
  {:else}
    <div class="flex flex-1 flex-col gap-2 p-5">
      {#if category}
        <div class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
          {category}
        </div>
      {/if}
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {title}
      </h3>
      {#if description}
        <p class="line-clamp-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      {/if}
      <div class="mt-3 flex items-end justify-between gap-2">
        <div>
          <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {formatUsd(priceCents)}
          </span>
          {#if compareAtCents && compareAtCents > priceCents}
            <span class="ml-2 text-sm text-neutral-400 line-through">
              {formatUsd(compareAtCents)}
            </span>
          {/if}
          <div class="text-xs text-neutral-500">
            {i18n.t("shop.fileCount", { count: fileCount })}
          </div>
        </div>
        <span
          class="rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground group-hover:bg-brand-hover"
        >
          {i18n.t("shop.viewPack")}
        </span>
      </div>
    </div>
  {/if}
</InternalLink>
