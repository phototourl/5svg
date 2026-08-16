<script lang="ts">
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ProductCard from "@/components/shop/ProductCard.svelte";
  import WholeShopBanner from "@/components/shop/WholeShopBanner.svelte";
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
    <WholeShopBanner
      slug={data.wholeShop.slug}
      priceCents={data.wholeShop.priceCents}
      compareAtCents={data.wholeShop.compareAtCents}
      fileCount={data.wholeShop.fileCount}
      previewPath={data.wholeShop.previewPath}
    />
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
          <ProductCard
            slug={product.slug}
            title={product.title}
            description={product.description}
            category={product.category}
            priceCents={product.priceCents}
            compareAtCents={product.compareAtCents}
            fileCount={product.fileCount}
            previewPath={product.previewPath}
          />
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
