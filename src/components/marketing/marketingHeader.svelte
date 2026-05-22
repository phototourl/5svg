<script lang="ts">
  import { brand } from "@/brand";
  import { cn } from "@/utils/cn";
  import { buttonVariants } from "@/components/ui/button";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ModeToggle from "@/components/modeToggle.svelte";
  import LanguageSwitcher from "@/components/layout/languageSwitcher.svelte";
  import logoStackLight from "@/components/logos/logo_stack_light.png";
  import logoStackDark from "@/components/logos/logo_stack_dark.png";
  import { siteLogoAlt } from "@/utils/svgAlt";
  import { getI18n } from "@/lib/i18n/context";

  import Search from "@lucide/svelte/icons/search";
  import Menu from "@lucide/svelte/icons/menu";

  const i18n = $derived(getI18n());

  let mobileOpen = $state(false);

  const navLinks = $derived([
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    { href: "/favorites", label: i18n.t("common.nav.favorites") },
    ...(brand.showApiNav ? ([{ href: "/docs/api", label: i18n.t("common.nav.api") }] as const) : []),
    ...(brand.showDeveloperTools
      ? ([
          { href: "/extensions", label: i18n.t("common.nav.extensions") },
          { href: "/docs/shadcn-ui", label: i18n.t("common.nav.shadcn") },
        ] as const)
      : []),
  ]);
</script>

<header
  class="sticky top-0 z-50 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
>
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
    <InternalLink href="/" className="flex shrink-0 items-center gap-2.5">
      <span class="inline-flex h-10 w-11 shrink-0 items-center justify-center overflow-visible">
        <img
          src={logoStackLight}
          alt={siteLogoAlt}
          width={80}
          height={80}
          class="h-10 w-10 origin-center scale-[1.75] object-contain dark:hidden"
        />
        <img
          src={logoStackDark}
          alt={siteLogoAlt}
          aria-hidden="true"
          width={80}
          height={80}
          class="hidden h-10 w-10 origin-center scale-[1.75] object-contain dark:block"
        />
      </span>
      <span
        class="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
        >{brand.displayName}</span
      >
    </InternalLink>

    <nav class="hidden items-center gap-1 lg:flex">
      {#each navLinks as link (link.href)}
        <InternalLink
          href={link.href}
          className={cn(
            "px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:text-brand",
            "dark:text-neutral-400 dark:hover:text-brand",
          )}
        >
          {link.label}
        </InternalLink>
      {/each}
    </nav>

    <div class="flex items-center gap-1">
      <LanguageSwitcher />
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
    <nav
      class="border-t border-neutral-200 px-4 py-3 lg:hidden dark:border-neutral-800"
    >
      <ul class="flex flex-col gap-1">
        {#each navLinks as link (link.href)}
          <li>
            <InternalLink
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wide text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {link.label}
            </InternalLink>
          </li>
        {/each}
      </ul>
    </nav>
  {/if}
</header>
