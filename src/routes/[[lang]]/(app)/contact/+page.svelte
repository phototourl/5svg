<script lang="ts">
  import Container from "@/components/container.svelte";
  import Button from "@/components/ui/button/button.svelte";
  import { brand } from "@/brand";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());
  const supportEmail = brand.supportEmail;

  let name = $state("");
  let email = $state("");
  let message = $state("");
  let status = $state<"idle" | "opened">("idle");

  function submit(e: Event) {
    e.preventDefault();
    const subject = encodeURIComponent(`5SVG contact from ${name.trim() || "visitor"}`);
    const body = encodeURIComponent(
      `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
    status = "opened";
  }
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
    <p class="text-neutral-600 dark:text-neutral-400">
      {i18n.t("ContactPage.introShort")}
    </p>

    <section class="mt-4">
      <h2 class="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        {i18n.t("ContactPage.whyTitle")}
      </h2>
      <ul class="mt-1.5 list-inside list-disc space-y-0.5 text-sm text-neutral-600 dark:text-neutral-400">
        <li>{i18n.t("ContactPage.why1")}</li>
        <li>{i18n.t("ContactPage.why2")}</li>
        <li>{i18n.t("ContactPage.why3")}</li>
        <li>{i18n.t("ContactPage.why4")}</li>
      </ul>
    </section>

    <form
      class="mt-8 space-y-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
      onsubmit={submit}
    >
      <div>
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {i18n.t("ContactPage.form.title")}
        </h2>
        <p class="mt-1 text-sm text-neutral-500">
          {i18n.t("ContactPage.form.description")}
        </p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="contact-name">
          {i18n.t("ContactPage.form.name")}
        </label>
        <input
          id="contact-name"
          required
          minlength={2}
          maxlength={40}
          bind:value={name}
          placeholder={i18n.t("ContactPage.form.namePlaceholder")}
          class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="contact-email">
          {i18n.t("ContactPage.form.email")}
        </label>
        <input
          id="contact-email"
          type="email"
          required
          bind:value={email}
          placeholder={i18n.t("ContactPage.form.emailPlaceholder")}
          class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="contact-message">
          {i18n.t("ContactPage.form.message")}
        </label>
        <textarea
          id="contact-message"
          required
          minlength={10}
          maxlength={2000}
          rows={5}
          bind:value={message}
          placeholder={i18n.t("ContactPage.form.messagePlaceholder")}
          class="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-950"
        ></textarea>
      </div>
      <Button type="submit" variant="default" class="w-full">
        {i18n.t("ContactPage.form.submit")}
      </Button>
      {#if status === "opened"}
        <p class="text-sm text-neutral-500">{i18n.t("ContactPage.form.mailtoHint")}</p>
      {/if}
    </form>

    <section
      class="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <h2 class="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
        {i18n.t("ContactPage.expectTitle")}
      </h2>
      <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {i18n.t("ContactPage.expectContent")}
      </p>
    </section>

    <p class="mt-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {i18n.t("ContactPage.orEmail")}{" "}
      <a
        class="font-medium text-brand-energy hover:underline dark:text-brand"
        href={`mailto:${supportEmail}`}
      >
        {supportEmail}
      </a>
    </p>
  </Container>
</div>
