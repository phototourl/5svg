<script lang="ts">
  import { tagPages } from "@/config/tag-pages";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { cn } from "@/utils/cn";
</script>

<Container className="my-8 max-w-3xl">
  <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
    SVG topics & collections
  </h1>
  <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
    Curated landing pages for popular searches — social logos, AI brands, Cricut crafts, and more.
  </p>

  <ul class="mt-8 space-y-4">
    {#each tagPages as tag (tag.slug)}
      <li
        class={cn(
          "rounded-md border border-neutral-200 p-4 dark:border-neutral-800",
        )}
      >
        <InternalLink
          href={`/tags/${tag.slug}`}
          className="text-lg font-medium text-brand-energy dark:text-brand"
        >
          {tag.h1}
        </InternalLink>
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {tag.lead}
        </p>
      </li>
    {/each}
  </ul>
</Container>
