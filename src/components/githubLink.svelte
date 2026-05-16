<script lang="ts">
  import { cn } from "@/utils/cn";
  import { brand } from "@/brand";
  import { buttonVariants } from "@/components/ui/button";
  import logoStackLight from "@/components/logos/logo_stack_light.png";
  import logoStackDark from "@/components/logos/logo_stack_dark.png";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { siteLogoAlt } from "@/utils/svgAlt";
</script>

<InternalLink
  title={brand.displayName}
  href="/library"
  className={cn(
    buttonVariants({ variant: "ghost" }),
    "size-9 shrink-0 p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800",
  )}
>
  <img
    src={logoStackLight}
    alt={siteLogoAlt}
    width={28}
    height={28}
    class="size-full object-contain dark:hidden"
    decoding="async"
  />
  <img
    src={logoStackDark}
    alt={siteLogoAlt}
    aria-hidden="true"
    width={28}
    height={28}
    class="hidden size-full object-contain dark:block"
    decoding="async"
  />
</InternalLink>
