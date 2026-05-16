<script lang="ts">
  import { cn } from "@/utils/cn";
  import { page } from "$app/state";

  import ModeToggle from "@/components/modeToggle.svelte";
  import HomeLink from "@/components/layout/homeLink.svelte";
  import HeaderNav from "@/components/layout/headerNav.svelte";
  import SidebarMobileMenu from "@/components/layout/sidebarMobileMenu.svelte";
  import { buttonVariants } from "@/components/ui/button";
</script>

<header
  class="sticky top-0 z-50 w-full bg-neutral-100 px-2 py-3 md:px-4 md:py-4 dark:bg-neutral-950"
>
  <nav class="flex w-full items-center justify-between">
    <div class="flex items-center space-x-2">
      {#if page.url.pathname !== "/"}
        <SidebarMobileMenu className="md:hidden" />
      {/if}
      <HomeLink />
      <HeaderNav />
    </div>
    <div class="flex items-center">
      <ModeToggle
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "hover:bg-neutral-200 dark:hover:bg-neutral-800",
        )}
      />
    </div>
  </nav>
</header>
