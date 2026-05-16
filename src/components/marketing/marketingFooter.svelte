<script lang="ts">
  import { brand } from "@/brand";
  import InternalLink from "@/components/ui/links/internal-link.svelte";

  const infoLinks = [
    { href: "/library", label: "Explore library" },
    { href: "/favorites", label: "Favorites" },
    { href: "/", label: "Home" },
  ] as const;

  const resourceLinks = [
    { href: "/directory/design", label: "Design" },
    { href: "/directory/social", label: "Social" },
    { href: "/directory/software", label: "Software" },
  ] as const;
</script>

<footer class="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
    <div>
      <h3
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand-energy"
      >
        Explore
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
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand-energy"
      >
        Categories
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
        class="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-energy dark:text-brand-energy"
      >
        We're here for you
      </h3>
      <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        Browse free SVG files for crafts, stickers, shirts, and everyday design. Search the
        library, download what you need, and save favorites for later.
      </p>
    </div>
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
