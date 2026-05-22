<script lang="ts">
  import { brand } from "@/brand";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import LanguageSwitcher from "@/components/layout/languageSwitcher.svelte";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());

  const infoLinks = $derived([
    { href: "/library", label: i18n.t("common.footer.exploreLibrary") },
    { href: "/browse", label: i18n.t("common.footer.browseIndex") },
    { href: "/favorites", label: i18n.t("common.nav.favorites") },
    { href: "/", label: i18n.t("common.footer.home") },
  ]);

  const resourceLinks = $derived([
    { href: "/directory/design", label: i18n.t("common.footer.design") },
    { href: "/directory/social", label: i18n.t("common.footer.social") },
    { href: "/directory/software", label: i18n.t("common.footer.software") },
  ]);

  const legalLinks = $derived([
    { href: "/about", label: i18n.t("common.footer.about") },
    { href: "/license", label: i18n.t("common.footer.license") },
    { href: "/privacy", label: i18n.t("common.footer.privacy") },
  ]);
</script>

<footer class="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto flex max-w-6xl justify-end px-4 pt-8">
    <LanguageSwitcher />
  </div>
  <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
    <div>
      <h3
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand"
      >
        {i18n.t("common.footer.explore")}
      </h3>
      <ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {#each infoLinks as link (link.href)}
          <li>
            <InternalLink
              href={link.href}
              className="transition-colors hover:text-brand-energy dark:hover:text-brand"
            >
              {link.label}
            </InternalLink>
          </li>
        {/each}
      </ul>
    </div>

    <div>
      <h3
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand"
      >
        {i18n.t("common.footer.categories")}
      </h3>
      <ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {#each resourceLinks as link (link.href)}
          <li>
            <InternalLink
              href={link.href}
              className="transition-colors hover:text-brand-energy dark:hover:text-brand"
            >
              {link.label}
            </InternalLink>
          </li>
        {/each}
      </ul>
    </div>

    <div>
      <h3
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand"
      >
        {i18n.t("common.footer.legal")}
      </h3>
      <ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {#each legalLinks as link (link.href)}
          <li>
            <InternalLink
              href={link.href}
              className="transition-colors hover:text-brand-energy dark:hover:text-brand"
            >
              {link.label}
            </InternalLink>
          </li>
        {/each}
      </ul>
    </div>

    <div>
      <h3
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand"
      >
        {i18n.t("common.footer.supportTitle")}
      </h3>
      <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {i18n.t("common.footer.supportBody")}
      </p>
    </div>
  </div>

  <div
    class="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 px-4 py-4 dark:border-neutral-800"
  >
    <a
      href="https://www.producthunt.com/products/5svg?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-5svg"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1150063&theme=light"
        width="250"
        height="54"
        alt="5SVG — Free SVG Logo & Icon Library on Product Hunt"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://fazier.com/launches/5svg.com"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light"
        width="120"
        height="28"
        alt="Fazier badge"
        class="h-6 w-auto shrink-0 opacity-90 transition-opacity hover:opacity-100"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://fwfw.app/item/5svg"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://fwfw.app/badge-white.svg"
        width="250"
        height="54"
        alt="Featured on FWFW"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://showmebest.ai"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://showmebest.ai/badge/feature-badge-white.webp"
        width="220"
        height="60"
        alt="Featured on ShowMeBestAI"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://goodaitools.com/ai/5svg"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://goodaitools.com/assets/images/badge.png"
        height="54"
        alt="Good AI Tools"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://twelve.tools"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://twelve.tools/badge0-light.svg"
        width="200"
        height="54"
        alt="Featured on Twelve Tools"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://wired.business"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://wired.business/badge0-white.svg"
        width="200"
        height="54"
        alt="Featured on Wired Business"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://findly.tools/5svg?utm_source=5svg"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://findly.tools/badges/findly-tools-badge-light.svg"
        width="175"
        height="55"
        alt="Featured on Findly.tools"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://aiagentsdirectory.com/agent/5svg?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=5svg"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
        width="200"
        height="50"
        alt="5SVG - Featured AI Agent on AI Agents Directory"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://submitaitools.org"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://submitaitools.org/static_submitaitools/images/submitaitools.png"
        width="200"
        height="60"
        alt="Submit AI Tools"
        class="h-6 w-auto shrink-0 rounded-[10px]"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://turbo0.com/item/5svg"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://img.turbo0.com/badge-listed-light.svg"
        height="54"
        alt="Listed on Turbo0"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://dofollow.tools"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://dofollow.tools/badge/badge_light.svg"
        width="200"
        height="54"
        alt="Featured on Dofollow.Tools"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://dayslaunch.com"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://dayslaunch.com/badages-awards.svg"
        height="54"
        alt="Featured on Days Launch"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://frogdr.com/5svg.com?utm_source=5svg.com"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://frogdr.com/5svg.com/badge-white.svg"
        width="250"
        height="54"
        alt="Monitor your Domain Rating with FrogDR"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://www.toolpilot.ai"
      target="_blank"
      rel="noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png"
        width="120"
        height="28"
        alt="Featured on Toolpilot"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
    <a
      href="https://dang.ai/"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
        width="150"
        height="54"
        alt="Dang.ai"
        class="h-6 w-auto shrink-0"
        loading="lazy"
        decoding="async"
      />
    </a>
  </div>

  <div
    class="bg-brand-energy px-4 py-8 text-center text-brand-energy-foreground dark:bg-brand-energy"
  >
    <p class="text-sm font-semibold">
      © {new Date().getFullYear()}
      {brand.displayName}. {brand.copyrightRights}
    </p>
    <p class="mt-2 overflow-x-auto text-xs whitespace-nowrap text-brand-energy-foreground/90">
      {brand.copyrightDisclaimer}
    </p>
  </div>
</footer>
