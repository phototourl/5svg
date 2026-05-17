<script lang="ts">
  import { privacyPage } from "@/config/trust-pages";
  import Container from "@/components/container.svelte";
</script>

<Container className="my-8 max-w-3xl">
  <h1 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
    {privacyPage.h1}
  </h1>
  {#each privacyPage.sections as section (section.h2)}
    <section class="mt-8">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
        {section.h2}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {section.body}
      </p>
    </section>
  {/each}
</Container>
