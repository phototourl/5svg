<script lang="ts">
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { brand } from "@/brand";
  import { getI18n } from "@/lib/i18n/context";
  import { getLegalPage } from "@/lib/i18n/legal-pages";
  import { page } from "$app/state";
  import type { Messages } from "@/lib/i18n/messages";

  const i18n = $derived(getI18n());
  const legal = $derived(
    getLegalPage((page.data.messages as Messages) ?? {}, "license"),
  );
</script>

<svelte:head>
  <title>{legal.title}</title>
  <meta name="description" content={legal.description} />
</svelte:head>

<Container className="my-8 max-w-3xl">
  <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {legal.h1}
  </h1>
  <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
    {legal.description}
  </p>
  {#each legal.sections as section (section.h2)}
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
    <InternalLink href="/terms" className="text-brand-energy dark:text-brand">
      {i18n.t("common.footer.termsOfService")} →
    </InternalLink>
    <span class="mx-2">·</span>
    <InternalLink href="/privacy" className="text-brand-energy dark:text-brand">
      {i18n.t("common.footer.privacyPolicy")} →
    </InternalLink>
    <span class="mx-2">·</span>
    <a href={`mailto:${brand.supportEmail}`} class="text-brand-energy dark:text-brand">
      {brand.supportEmail}
    </a>
  </p>
</Container>
