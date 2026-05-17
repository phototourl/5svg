<script lang="ts">
  import { aboutPage } from "@/config/trust-pages";
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
</script>

<Container className="my-8 max-w-3xl prose-neutral dark:prose-invert">
  <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
    {aboutPage.h1}
  </h1>
  {#each aboutPage.sections as section (section.h2)}
    <section class="mt-8">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {section.h2}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {section.body}
      </p>
    </section>
  {/each}
  <p class="mt-10 text-sm text-neutral-500">
    <InternalLink href="/license" className="text-brand-energy dark:text-brand">
      License & trademarks →
    </InternalLink>
  </p>
</Container>
