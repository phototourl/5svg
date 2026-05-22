<script lang="ts">
  import Search from "@lucide/svelte/icons/search";
  import Download from "@lucide/svelte/icons/download";
  import Heart from "@lucide/svelte/icons/heart";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());

  const steps = $derived([
    {
      icon: Search,
      title: i18n.t("home.how.searchTitle"),
      description: i18n.t("home.how.searchDesc"),
    },
    {
      icon: Download,
      title: i18n.t("home.how.downloadTitle"),
      description: i18n.t("home.how.downloadDesc"),
    },
    {
      icon: Heart,
      title: i18n.t("home.how.favoritesTitle"),
      description: i18n.t("home.how.favoritesDesc"),
    },
  ]);
</script>

<section
  class="border-y border-neutral-200 bg-white py-12 md:py-16 dark:border-neutral-800 dark:bg-neutral-950"
>
  <div class="mx-auto max-w-6xl px-4">
    <p
      class="mx-auto w-fit rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
    >
      {i18n.t("home.how.tag")}
    </p>
    <h2
      class="mt-4 text-center text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-neutral-50"
    >
      {i18n.t("home.how.title")}
    </h2>
    <p class="mx-auto mt-2 max-w-xl text-center text-sm text-neutral-600 dark:text-neutral-400">
      {i18n.t("home.how.subtitle")}
    </p>

    <ol class="mt-10 grid list-none gap-10 p-0 md:grid-cols-3 md:gap-8">
      {#each steps as item (item.title)}
        {@const Icon = item.icon}
        <li class="text-center">
          <div
            class="mx-auto flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900"
          >
            <Icon size={20} strokeWidth={1.5} class="text-brand" aria-hidden="true" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-neutral-900 dark:text-neutral-50">
            {item.title}
          </h3>
          <p
            class="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {item.description}
          </p>
        </li>
      {/each}
    </ol>
  </div>
</section>
