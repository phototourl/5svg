<script lang="ts">
  import { cn } from "@/utils/cn";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());

  const homeSeoBlocks = $derived([
    {
      id: "what",
      tag: i18n.t("home.seoBlocks.whatTag"),
      title: i18n.t("home.seoBlocks.whatTitle"),
      body: i18n.t("home.seoBlocks.whatBody"),
      bullets: [
        i18n.t("home.seoBlocks.whatB1"),
        i18n.t("home.seoBlocks.whatB2"),
        i18n.t("home.seoBlocks.whatB3"),
      ],
      bannerImage: "/banner1.jpg",
      bannerAlt: i18n.t("home.seoBlocks.whatAlt"),
    },
    {
      id: "uses",
      tag: i18n.t("home.seoBlocks.usesTag"),
      title: i18n.t("home.seoBlocks.usesTitle"),
      body: i18n.t("home.seoBlocks.usesBody"),
      bullets: [
        i18n.t("home.seoBlocks.usesB1"),
        i18n.t("home.seoBlocks.usesB2"),
        i18n.t("home.seoBlocks.usesB3"),
        i18n.t("home.seoBlocks.usesB4"),
      ],
      bannerImage: "/banner2.png",
      bannerAlt: i18n.t("home.seoBlocks.usesAlt"),
      reverse: true,
    },
    {
      id: "get",
      tag: i18n.t("home.seoBlocks.getTag"),
      title: i18n.t("home.seoBlocks.getTitle"),
      body: i18n.t("home.seoBlocks.getBody"),
      bullets: [
        i18n.t("home.seoBlocks.getB1"),
        i18n.t("home.seoBlocks.getB2"),
        i18n.t("home.seoBlocks.getB3"),
        i18n.t("home.seoBlocks.getB4"),
      ],
      bannerImage: "/banner3.png",
      bannerAlt: i18n.t("home.seoBlocks.getAlt"),
    },
  ]);

  const homeSeoFaq = $derived([
    { question: i18n.t("home.faq.q1"), answer: i18n.t("home.faq.a1") },
    { question: i18n.t("home.faq.q2"), answer: i18n.t("home.faq.a2") },
    { question: i18n.t("home.faq.q3"), answer: i18n.t("home.faq.a3") },
    { question: i18n.t("home.faq.q4"), answer: i18n.t("home.faq.a4") },
  ]);
</script>

<section class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto max-w-3xl px-4 py-14 text-center md:py-16">
    <p
      class="inline-block rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
    >
      {i18n.t("home.seoIntro.tag")}
    </p>
    <h2
      class="mt-4 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50"
    >
      {i18n.t("home.seoIntro.title")}
    </h2>
    <p class="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
      {i18n.t("home.seoIntro.description")}
    </p>
  </div>
</section>

{#each homeSeoBlocks as block (block.id)}
  <section
    class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
  >
    <div
      class={cn(
        "mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-16",
        block.reverse && "md:[&>*:first-child]:order-2",
      )}
    >
      <div>
        <p
          class="inline-block rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
        >
          {block.tag}
        </p>
        <h2
          class="mt-4 text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-50"
        >
          {block.title}
        </h2>
        <p class="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base dark:text-neutral-400">
          {block.body}
        </p>
        <ul class="mt-5 space-y-2.5">
          {#each block.bullets as bullet (bullet)}
            <li class="flex gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
              <span
                class="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
                aria-hidden="true"
              ></span>
              {bullet}
            </li>
          {/each}
        </ul>
      </div>

      <div
        class="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50"
      >
        <img
          src={block.bannerImage}
          alt={block.bannerAlt}
          class="block w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
{/each}

<section
  class="w-full border-b border-neutral-200 bg-neutral-100 py-12 md:py-16 dark:border-neutral-800 dark:bg-neutral-900/50"
>
  <article class="mx-auto max-w-3xl px-4">
    <img
      src="/og-image.png"
      alt={i18n.t("home.bannerAlt")}
      class="mx-auto mb-8 block max-w-md object-contain"
      loading="lazy"
      decoding="async"
    />
    <h2
      class="text-center text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50"
    >
      {i18n.t("home.faq.title")}
    </h2>
    <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
      {i18n.t("home.faq.subtitle")}
    </p>
    <p class="mt-4 text-center text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      {i18n.t("home.faq.lead")}
    </p>
    <dl class="mt-10 space-y-6">
      {#each homeSeoFaq as item (item.question)}
        <div class="rounded-xl border border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950">
          <dt class="font-semibold text-neutral-900 dark:text-neutral-50">{item.question}</dt>
          <dd class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {item.answer}
          </dd>
        </div>
      {/each}
    </dl>
  </article>
</section>
