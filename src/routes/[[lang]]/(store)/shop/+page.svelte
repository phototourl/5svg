<script lang="ts">
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { formatUsd } from "@/lib/shop";
  import { getI18n } from "@/lib/i18n/context";
  import { page } from "$app/state";

  const i18n = $derived(getI18n());
  const data = $derived(page.data as {
    products: Array<{
      slug: string;
      title: string;
      description: string;
      category: string;
      priceCents: number;
      compareAtCents?: number;
      fileCount: number;
      previewPath: string;
    }>;
    categories: string[];
    activeCategory: string | null;
    wholeShop: {
      slug: string;
      title: string;
      description: string;
      priceCents: number;
      compareAtCents?: number;
      fileCount: number;
      previewPath: string;
    } | null;
  });

  const showWholeShop = $derived(!!data.wholeShop && !data.activeCategory);
</script>

<svelte:head>
  <title>{i18n.t("shop.seoTitle")}</title>
  <meta name="description" content={i18n.t("shop.seoDescription")} />
</svelte:head>

<Container className="my-10 max-w-6xl">
  <header class="text-center sm:text-left">
    <h1 class="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
      {i18n.t("shop.title")}
    </h1>
  </header>

  {#if showWholeShop && data.wholeShop}
    <section class="mt-10" aria-labelledby="shop-whole-heading">
      <h2
        id="shop-whole-heading"
        class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
      >
        {i18n.t("shop.wholeShopTitle")}
      </h2>
      <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {i18n.t("shop.wholeShopLead", { count: data.wholeShop.fileCount })}
      </p>
      <InternalLink
        href={`/shop/${data.wholeShop.slug}`}
        className="mt-5 flex cursor-pointer items-stretch overflow-hidden rounded-2xl border border-brand/40 bg-white no-underline shadow-sm transition hover:border-brand hover:shadow-md dark:border-brand/50 dark:bg-neutral-950"
      >
        <div class="relative w-[40%] shrink-0 bg-white md:w-[36%] dark:bg-white">
          <img
            src={data.wholeShop.previewPath}
            alt=""
            class="h-full w-full object-cover object-center"
          />
        </div>
        <div
          class="flex min-w-0 flex-1 flex-col justify-center gap-2 border-l border-brand/20 bg-brand/5 px-4 py-4 sm:px-5 dark:border-brand/40 dark:bg-brand/10"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
            {i18n.t("shop.wholeShopBadge")}
          </p>
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <span class="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-neutral-50">
              {formatUsd(data.wholeShop.priceCents)}
            </span>
            {#if data.wholeShop.compareAtCents && data.wholeShop.compareAtCents > data.wholeShop.priceCents}
              <span class="text-sm text-neutral-400 line-through">
                {formatUsd(data.wholeShop.compareAtCents)}
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
  {/if}

  <section
    class={showWholeShop ? "mt-12" : "mt-10"}
    aria-labelledby="shop-theme-heading"
  >
    <div class={showWholeShop ? "border-t border-neutral-200 pt-10 dark:border-neutral-800" : ""}>
      <h2
        id="shop-theme-heading"
        class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
      >
        {i18n.t("shop.themePacksHeading")}
      </h2>
      <p class="mt-1 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
        {i18n.t("shop.themePacksLead")}
      </p>

      <div class="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
        <InternalLink
          href="/shop"
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            !data.activeCategory
              ? "bg-brand text-brand-foreground"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
          }`}
        >
          {i18n.t("shop.allCategories")}
        </InternalLink>
        {#each data.categories as cat (cat)}
          <InternalLink
            href={`/shop?category=${encodeURIComponent(cat)}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              data.activeCategory?.toLowerCase() === cat.toLowerCase()
                ? "bg-brand text-brand-foreground"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
            }`}
          >
            {cat}
          </InternalLink>
        {/each}
      </div>

      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each data.products as product (product.slug)}
          <InternalLink
            href={`/shop/${product.slug}`}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white no-underline shadow-sm transition-shadow hover:border-brand/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-brand/50"
          >
            <div class="flex h-44 items-center justify-center bg-neutral-100 p-6 dark:bg-neutral-100">
              <img
                src={product.previewPath}
                alt={product.title}
                class="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.02]"
              />
            </div>
            <div class="flex flex-1 flex-col gap-2 p-5">
              <div class="text-xs font-semibold uppercase tracking-wide text-brand-energy dark:text-brand">
                {product.category}
              </div>
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {product.title}
              </h3>
              <p class="line-clamp-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                {product.description}
              </p>
              <div class="mt-3 flex items-end justify-between gap-2">
                <div>
                  <span class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    {formatUsd(product.priceCents)}
                  </span>
                  {#if product.compareAtCents && product.compareAtCents > product.priceCents}
                    <span class="ml-2 text-sm text-neutral-400 line-through">
                      {formatUsd(product.compareAtCents)}
                    </span>
                  {/if}
                  <div class="text-xs text-neutral-500">
                    {i18n.t("shop.fileCount", { count: product.fileCount })}
                  </div>
                </div>
                <span
                  class="rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground group-hover:bg-brand-hover"
                >
                  {i18n.t("shop.viewPack")}
                </span>
              </div>
            </div>
          </InternalLink>
        {:else}
          <p class="text-sm text-neutral-500 sm:col-span-2 lg:col-span-3">
            {i18n.t("shop.empty")}
          </p>
        {/each}
      </div>
    </div>
  </section>

  <p class="mt-12 text-center text-sm text-neutral-500 sm:text-left">
    {i18n.t("shop.freeHint")}
    <InternalLink href="/library" className="text-brand-energy dark:text-brand">
      {i18n.t("shop.freeLibraryLink")}
    </InternalLink>
  </p>
</Container>
