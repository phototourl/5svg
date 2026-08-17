<script lang="ts">
  import ProductCard from "@/components/shop/ProductCard.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getLiveThemeProducts, isShopEnabled } from "@/lib/shop";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());
  const shopOn = isShopEnabled();

  /** Stamp pack first; skip Halloween (previous #1). Keep Christmas + Fall next. */
  const featuredBundles = (() => {
    if (!shopOn) return [];
    const themes = getLiveThemeProducts();
    const stamp = themes.find((p) => p.slug === "craft-stamp-seals-pack");
    const rest = themes.filter(
      (p) =>
        p.slug !== "craft-stamp-seals-pack" &&
        p.slug !== "craft-halloween-pack",
    );
    return (stamp ? [stamp, ...rest] : rest).slice(0, 3);
  })();
</script>

{#if shopOn && featuredBundles.length > 0}
  <section class="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/40">
    <div class="mx-auto max-w-6xl px-4 py-12 md:py-14">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2
            class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
          >
            {i18n.t("home.shopStrip.title")}
          </h2>
          <p class="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            {i18n.t("home.shopStrip.subtitle")}
          </p>
        </div>
        <InternalLink
          href="/shop"
          className="text-sm font-medium text-brand-energy no-underline hover:underline dark:text-brand"
        >
          {i18n.t("home.shopStrip.viewAll")}
        </InternalLink>
      </div>
      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each featuredBundles as product (product.slug)}
          <ProductCard
            slug={product.slug}
            title={product.title}
            priceCents={product.priceCents}
            fileCount={product.fileCount}
            previewPath={product.previewPath}
            variant="home"
          />
        {/each}
      </div>
    </div>
  </section>
{/if}
