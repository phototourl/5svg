<script lang="ts">
  import { brand } from "@/brand";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import logoStackLight from "@/components/logos/logo_stack_light.png";
  import logoStackDark from "@/components/logos/logo_stack_dark.png";
  import { siteLogoAlt } from "@/utils/svgAlt";

  interface Props {
    /** header uses larger scaled mark; footer is compact */
    variant?: "header" | "footer";
    showName?: boolean;
  }

  let { variant = "header", showName = true }: Props = $props();

  const isHeader = $derived(variant === "header");
</script>

<InternalLink
  href="/"
  className="flex shrink-0 items-center gap-2 {isHeader ? '' : 'no-underline'}"
>
  <span
    class="inline-flex shrink-0 items-center justify-center overflow-visible {isHeader
      ? 'h-10 w-11'
      : 'h-10 w-10'}"
  >
    <img
      src={logoStackLight}
      alt={siteLogoAlt}
      width={isHeader ? 80 : 40}
      height={isHeader ? 80 : 40}
      class="object-contain dark:hidden {isHeader
        ? 'h-10 w-10 origin-center scale-[1.75]'
        : 'h-10 w-10'}"
      decoding="async"
    />
    <img
      src={logoStackDark}
      alt=""
      aria-hidden="true"
      width={isHeader ? 80 : 40}
      height={isHeader ? 80 : 40}
      class="hidden object-contain dark:block {isHeader
        ? 'h-10 w-10 origin-center scale-[1.75]'
        : 'h-10 w-10'}"
      decoding="async"
    />
  </span>
  {#if showName}
    <span class="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
      {brand.displayName}
    </span>
  {/if}
</InternalLink>
