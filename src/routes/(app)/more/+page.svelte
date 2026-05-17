<script lang="ts">
  import { iconPacks } from "@/config/icon-packs";
  import { cn } from "@/utils/cn";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import Layers from "@lucide/svelte/icons/layers";
</script>

<Container className="my-8 max-w-4xl">
  <div class="mb-8 flex items-center gap-3">
    <Layers size={28} strokeWidth={1.5} class="text-brand-energy dark:text-brand" />
    <div>
      <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        More icon packs
      </h1>
      <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Three standalone collections, separate from the main brand library.
        <InternalLink href="/browse" className="ml-1 text-brand-energy dark:text-brand">
          Brand logos A–Z
        </InternalLink>
      </p>
    </div>
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each iconPacks as pack (pack.id)}
      <article
        class={cn(
          "flex flex-col rounded-md border border-neutral-200 p-5 dark:border-neutral-800",
          "bg-white dark:bg-neutral-900/40",
        )}
      >
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {pack.name}
        </h2>
        <p class="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
          {pack.description}
        </p>
        <p class="mt-2 text-xs text-neutral-500">License: {pack.license}</p>
        <InternalLink
          href={`/more/${pack.id}`}
          className="mt-4 text-sm font-medium text-brand-energy dark:text-brand"
        >
          Browse pack →
        </InternalLink>
      </article>
    {/each}
  </div>
</Container>
