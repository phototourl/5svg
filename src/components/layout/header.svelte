<script lang="ts">
  import { cn } from "@/utils/cn";
  import { page } from "$app/state";

  import ModeToggle from "@/components/modeToggle.svelte";
  import HomeLink from "@/components/layout/homeLink.svelte";
  import HeaderNav from "@/components/layout/headerNav.svelte";
  import SidebarMobileMenu from "@/components/layout/sidebarMobileMenu.svelte";
  import LanguageSwitcher from "@/components/layout/languageSwitcher.svelte";
  import { buttonVariants } from "@/components/ui/button";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";

  const basePath = $derived(stripLocalePrefix(page.url.pathname, LOCALES));
</script>

<header
  class="sticky top-0 z-50 w-full bg-neutral-100 px-2 py-3 md:px-4 md:py-4 dark:bg-neutral-950"
>
  <nav class="flex w-full items-center justify-between">
    <div class="flex items-center space-x-2">
      {#if basePath !== "/"}
        <SidebarMobileMenu className="md:hidden" />
      {/if}
      <HomeLink />
      <HeaderNav />
    </div>
    <div class="flex items-center gap-1">
      <LanguageSwitcher />
      <ModeToggle
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hover:bg-neutral-200 dark:hover:bg-neutral-800",
        )}
      />
    </div>
  </nav>
</header>
