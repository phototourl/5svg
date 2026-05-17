<script lang="ts">
  import type { BreadcrumbItem } from "@/utils/breadcrumbs";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";

  interface Props {
    items: BreadcrumbItem[];
  }

  let { items }: Props = $props();
</script>

{#if items.length > 1}
  <nav
    class="mb-3 flex flex-wrap items-center gap-1 px-0.5 text-xs text-neutral-500 dark:text-neutral-400"
    aria-label="Breadcrumb"
  >
    {#each items as item, i (item.label)}
      {#if i > 0}
        <ChevronRight size={14} class="shrink-0 opacity-50" aria-hidden="true" />
      {/if}
      {#if item.href && i < items.length - 1}
        <InternalLink
          href={item.href}
          className="hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          {item.label}
        </InternalLink>
      {:else}
        <span class="text-neutral-700 dark:text-neutral-300">{item.label}</span>
      {/if}
    {/each}
  </nav>
{/if}
