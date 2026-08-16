<script lang="ts">
  import { cn } from "@/utils/cn";
  import { page } from "$app/state";
  import { buttonVariants } from "@/components/ui/button";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ModeToggle from "@/components/modeToggle.svelte";
  import LanguageSwitcher from "@/components/layout/languageSwitcher.svelte";
  import BrandLogoLink from "@/components/marketing/BrandLogoLink.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";
  import { isAppNavActive } from "@/lib/app-nav";

  import Search from "@lucide/svelte/icons/search";
  import Menu from "@lucide/svelte/icons/menu";

  const i18n = $derived(getI18n());
  const pathname = $derived(stripLocalePrefix(page.url.pathname, LOCALES));

  const navLinks = $derived([
    { href: "/", label: i18n.t("common.nav.home") },
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    { href: "/shop", label: i18n.t("common.nav.svgBundles") },
    { href: "/contact", label: i18n.t("common.nav.contact") },
  ]);

  let mobileOpen = $state(false);

  const linkBase =
    "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 no-underline transition-colors hover:bg-neutral-200/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100";
  const linkActive =
    "bg-brand-energy/15 text-brand-energy no-underline dark:bg-brand-energy/25 dark:text-brand";
</script>

<header class="bg-transparent">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
    <BrandLogoLink variant="header" />

    <nav class="hidden items-center gap-0.5 lg:flex">
      {#each navLinks as link (link.href)}
        <InternalLink
          href={link.href}
          className={cn(linkBase, isAppNavActive(link.href, pathname) && linkActive)}
        >
          {link.label}
        </InternalLink>
      {/each}
    </nav>

    <div class="flex items-center gap-1">
      <LanguageSwitcher />
      <InternalLink
        href="/shop"
        className={cn(
          buttonVariants({ size: "sm" }),
          "hidden no-underline sm:inline-flex",
        )}
      >
        {i18n.t("common.nav.shopNow")}
      </InternalLink>
      <InternalLink
        href="/library"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hidden sm:inline-flex",
        )}
        title={i18n.t("common.nav.searchLibrary")}
      >
        <Search size={20} strokeWidth={1.5} />
      </InternalLink>
      <ModeToggle
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        )}
      />
      <button
        type="button"
        class={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
        aria-label={i18n.t("common.nav.openMenu")}
        onclick={() => (mobileOpen = !mobileOpen)}
      >
        <Menu size={20} />
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <nav class="border-t border-neutral-200 px-4 py-3 lg:hidden dark:border-neutral-800">
      <ul class="flex flex-col gap-1 text-sm">
        {#each navLinks as link (link.href)}
          <li>
            <InternalLink
              href={link.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium",
                isAppNavActive(link.href, pathname) && "bg-neutral-200/80 dark:bg-neutral-800",
              )}
            >
              {link.label}
            </InternalLink>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</header>
