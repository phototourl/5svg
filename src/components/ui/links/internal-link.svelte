<script lang="ts">
  import type { LinkProps } from "@/components/ui/links/links.types";
  import { page } from "$app/state";
  import { localizePath } from "@/lib/i18n/paths";
  import { DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config";
  import { cn } from "@/utils/cn";

  interface InternalLinkProps extends LinkProps {
    preloadData?: boolean;
  }

  const {
    href: rawHref,
    label,
    title,
    className,
    children,
    preloadData,
  }: InternalLinkProps = $props();

  const locale = $derived((page.data.locale as AppLocale | undefined) ?? DEFAULT_LOCALE);
  const href = $derived(localizePath(rawHref, locale));
</script>

<a
  {href}
  {title}
  aria-label={label}
  class={cn(className)}
  data-sveltekit-preload-data={preloadData ? "" : "off"}
>
  {#if children}
    {@render children()}
  {/if}
</a>
