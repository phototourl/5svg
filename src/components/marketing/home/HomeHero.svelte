<script lang="ts">
  import { homeMarketingImage } from "@/config/home-seo";
  import MarketingHeroShowcase from "@/components/marketing/marketingHeroShowcase.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { buttonVariants } from "@/components/ui/button";
  import { cn } from "@/utils/cn";
  import { getI18n } from "@/lib/i18n/context";
  import { isShopEnabled } from "@/lib/shop";

  const i18n = $derived(getI18n());
  const shopOn = isShopEnabled();
</script>

<section class="bg-white dark:bg-neutral-950">
  <div
    class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16"
  >
    <div>
      <h1
        class="text-3xl font-semibold leading-tight tracking-tight text-neutral-900 md:text-4xl lg:text-5xl dark:text-neutral-50"
      >
        {i18n.t("home.hero.title")}
      </h1>
      <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
        {i18n.t("home.hero.subtitle")}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        {#if shopOn}
          <InternalLink
            href="/shop"
            className={cn(buttonVariants({ size: "lg" }), "no-underline")}
          >
            {i18n.t("home.hero.ctaShop")}
          </InternalLink>
          <InternalLink
            href="/library"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "no-underline",
            )}
          >
            {i18n.t("home.hero.ctaFree")}
          </InternalLink>
        {:else}
          <InternalLink
            href="/library"
            className={cn(buttonVariants({ size: "lg" }), "no-underline")}
          >
            {i18n.t("home.hero.ctaFree")}
          </InternalLink>
        {/if}
      </div>
      <img
        src={homeMarketingImage.bannerLogo}
        alt={homeMarketingImage.bannerLogoAlt}
        class="mt-8 w-full max-w-md object-contain"
        width="1200"
        height="630"
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </div>

    <MarketingHeroShowcase />
  </div>
</section>
