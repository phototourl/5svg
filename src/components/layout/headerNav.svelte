<script lang="ts">
  import { page } from "$app/state";
  import { brand } from "@/brand";
  import { cn } from "@/utils/cn";
  import InternalLink from "@/components/ui/links/internal-link.svelte";

  const links = [
    { href: "/library", label: "Free SVG" },
    { href: "/favorites", label: "Favorites" },
    ...(brand.showApiNav ? ([{ href: "/docs/api", label: "API" }] as const) : []),
    ...(brand.showDeveloperTools
      ? ([{ href: "/extensions", label: "Extensions" }] as const)
      : []),
  ] as const;

  function isActive(href: string, pathname: string) {
    if (href === "/library") {
      return pathname === "/library" || pathname.startsWith("/directory");
    }
    if (href === "/docs/api") {
      return pathname === "/docs/api" || pathname.startsWith("/docs/api/");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }
</script>

<nav class="ml-2 hidden items-center gap-0.5 md:flex">
  {#each links as link (link.href)}
    <InternalLink
      href={link.href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900",
        "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        isActive(link.href, page.url.pathname) &&
          "bg-brand-energy/15 text-brand-energy dark:bg-brand-energy/25 dark:text-brand",
      )}
    >
      {link.label}
    </InternalLink>
  {/each}
</nav>
