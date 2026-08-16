<script lang="ts">
  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { brand } from "@/brand";

  export type LegalFooterLink =
    | { type: "internal"; href: string; label: string }
    | { type: "email" };

  interface Props {
    title: string;
    description: string;
    h1: string;
    sections: Array<{ h2: string; body: string }>;
    footerLinks: LegalFooterLink[];
  }

  let { title, description, h1, sections, footerLinks }: Props = $props();
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
</svelte:head>

<Container className="my-8 max-w-3xl prose-neutral dark:prose-invert">
  <h1 class="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
    {h1}
  </h1>
  <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
    {description}
  </p>
  {#each sections as section (section.h2)}
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
    {#each footerLinks as link, i (link.type === "email" ? "email" : link.href)}
      {#if i > 0}
        <span class="mx-2">·</span>
      {/if}
      {#if link.type === "email"}
        <a href={`mailto:${brand.supportEmail}`} class="text-brand-energy dark:text-brand">
          {brand.supportEmail}
        </a>
      {:else}
        <InternalLink href={link.href} className="text-brand-energy dark:text-brand">
          {link.label} →
        </InternalLink>
      {/if}
    {/each}
  </p>
</Container>
