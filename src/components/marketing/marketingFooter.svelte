<script lang="ts">
  import { page } from "$app/state";
  import { brand } from "@/brand";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import LanguageSwitcher from "@/components/layout/languageSwitcher.svelte";
  import BrandLogoLink from "@/components/marketing/BrandLogoLink.svelte";
  import MarketingLaunchBadges from "@/components/marketing/MarketingLaunchBadges.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { cn } from "@/utils/cn";
  import { isShopEnabled } from "@/lib/shop";

  const i18n = $derived(getI18n());
  const shopOn = isShopEnabled();

  /** Clear fixed mobile checkout dock on product detail (not shop index). */
  const shopDetailDockPad = $derived(
    shopOn && /\/shop\/[^/]+\/?$/.test(page.url.pathname),
  );

  const productLinks = $derived([
    { href: "/", label: i18n.t("common.nav.home") },
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    ...(shopOn
      ? [{ href: "/shop", label: i18n.t("common.nav.svgBundles") }]
      : []),
  ]);

  const companyLinks = $derived([
    { href: "/about", label: i18n.t("common.footer.about") },
    { href: "/contact", label: i18n.t("common.nav.contact") },
  ]);

  const legalLinks = $derived([
    { href: "/license", label: i18n.t("common.footer.licensingPolicy") },
    { href: "/privacy", label: i18n.t("common.footer.privacyPolicy") },
    { href: "/terms", label: i18n.t("common.footer.termsOfService") },
  ]);

  const linkSections = $derived([
    { title: i18n.t("common.footer.product"), links: productLinks },
    { title: i18n.t("common.footer.company"), links: companyLinks },
    { title: i18n.t("common.footer.legal"), links: legalLinks },
  ]);
</script>

<footer
  class={cn(
    "border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
    shopDetailDockPad && "pb-40 md:pb-0",
  )}
>  <div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-5">
      <div class="col-span-2 flex flex-col items-start">
        <BrandLogoLink variant="footer" />
        <p class="mt-4 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {i18n.t("common.footer.tagline")}
        </p>
        <a
          href={`mailto:${brand.supportEmail}`}
          class="mt-4 text-sm text-neutral-500 transition-colors hover:text-brand-energy dark:text-neutral-400 dark:hover:text-brand"
        >
          {brand.supportEmail}
        </a>
        <div class="mt-5">
          <LanguageSwitcher />
        </div>
      </div>

      {#each linkSections as section (section.title)}
        <div class="col-span-1">
          <span
            class="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-neutral-50"
          >
            {section.title}
          </span>
          <ul class="mt-4 space-y-3">
            {#each section.links as link (link.href)}
              <li>
                <InternalLink
                  href={link.href}
                  className="text-sm text-neutral-500 transition-colors hover:text-brand-energy dark:text-neutral-400 dark:hover:text-brand"
                >
                  {link.label}
                </InternalLink>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>

  <MarketingLaunchBadges />

  <div class="border-t border-neutral-200 py-4 dark:border-neutral-800">
    <div class="mx-auto max-w-6xl px-4 text-center">
      <p class="text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()}
        {brand.displayName}. {brand.copyrightRights}
      </p>
      <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
        {brand.copyrightDisclaimer}
      </p>
    </div>
  </div>
</footer>
