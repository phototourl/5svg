<script lang="ts">
  import Container from "@/components/container.svelte";
  import ContactForm from "@/components/contact/ContactForm.svelte";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());
</script>

<svelte:head>
  <title>{i18n.t("ContactPage.title")} — 5SVG</title>
  <meta name="description" content={i18n.t("ContactPage.description")} />
</svelte:head>

<div class="mb-16">
  <div class="mt-8 flex w-full flex-col items-center justify-center gap-4 px-4">
    <div class="mx-auto max-w-3xl space-y-4 text-center">
      <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {i18n.t("ContactPage.title")}
      </h1>
      <p class="text-lg text-neutral-600 dark:text-neutral-400">
        {i18n.t("ContactPage.subtitle")}
      </p>
    </div>
  </div>

  <Container className="mt-8 max-w-xl px-4">
    <ContactForm />
  </Container>
</div>
