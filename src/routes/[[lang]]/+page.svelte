<script lang="ts">
  import { brand } from "@/brand";
  import { siteSeo } from "@/config/seo";
  import { sampleSvgs } from "@/data";
  import MarketingLogoMarquee from "@/components/marketing/marketingLogoMarquee.svelte";
  import MarketingSeoSections from "@/components/marketing/marketingSeoSections.svelte";
  import MarketingHowItWorks from "@/components/marketing/marketingHowItWorks.svelte";
  import HomeHero from "@/components/marketing/home/HomeHero.svelte";
  import HomeValueProps from "@/components/marketing/home/HomeValueProps.svelte";
  import HomeFeaturedBundles from "@/components/marketing/home/HomeFeaturedBundles.svelte";
  import HomeCraftUses from "@/components/marketing/home/HomeCraftUses.svelte";
  import HomeLibraryOverview from "@/components/marketing/home/HomeLibraryOverview.svelte";
  import { getHomeFaq } from "@/lib/i18n/home-faq";
  import { getI18n } from "@/lib/i18n/context";
  import { isShopEnabled } from "@/lib/shop";

  const i18n = $derived(getI18n());
  const homeSeoFaq = $derived(getHomeFaq(i18n.t));
  const shopOn = isShopEnabled();

  const marqueeRowA = sampleSvgs(20, 0);
  const marqueeRowB = sampleSvgs(20, 11);

  const scriptClose = "</" + "script>";
  const jsonLdGraph = $derived({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${brand.siteUrl}/#organization`,
        name: siteSeo.siteName,
        url: siteSeo.url,
        logo: `${brand.siteUrl}/favicon.png`,
        email: brand.supportEmail,
        contactPoint: {
          "@type": "ContactPoint",
          email: brand.supportEmail,
          contactType: "customer support",
        },
        sameAs: [brand.githubUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${brand.siteUrl}/#website`,
        name: siteSeo.siteName,
        url: siteSeo.url,
        description: i18n.t("seo.description"),
        publisher: { "@id": `${brand.siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${brand.siteUrl}/library?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      ...(shopOn
        ? [
            {
              "@type": "Store",
              "@id": `${brand.siteUrl}/#store`,
              name: "5SVG Bundles",
              url: `${brand.siteUrl}/shop`,
              description:
                "Digital craft SVG Bundles — one-time purchase ZIP downloads for makers.",
              parentOrganization: { "@id": `${brand.siteUrl}/#organization` },
            },
          ]
        : []),
      {
        "@type": "FAQPage",
        "@id": `${brand.siteUrl}/#faq`,
        mainEntity: homeSeoFaq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  });

  const websiteJsonLdHtml = $derived(
    '<script type="application/ld+json">' +
      JSON.stringify(jsonLdGraph) +
      scriptClose,
  );
</script>

<svelte:head>
  <meta name="keywords" content={i18n.t("seo.keywords")} />
  {@html websiteJsonLdHtml}
</svelte:head>

<HomeHero />

<section
  class="space-y-3 border-y border-neutral-200 bg-neutral-50 py-6 dark:border-neutral-800 dark:bg-neutral-900/50"
  aria-label={i18n.t("home.hero.marqueeAria")}
>
  <MarketingLogoMarquee items={marqueeRowA} duration="50s" />
  <MarketingLogoMarquee items={marqueeRowB} reverse duration="55s" />
</section>

<HomeValueProps />
<HomeFeaturedBundles />
<MarketingSeoSections />
<HomeCraftUses />
<MarketingHowItWorks />
<HomeLibraryOverview />
