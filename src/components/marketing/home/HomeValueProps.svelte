<script lang="ts">
  import Truck from "@lucide/svelte/icons/truck";
  import BadgePercent from "@lucide/svelte/icons/badge-percent";
  import Headphones from "@lucide/svelte/icons/headphones";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());

  const valueProps = $derived([
    {
      icon: Truck,
      title: i18n.t("home.value.freeTitle"),
      description: i18n.t("home.value.freeDesc"),
    },
    {
      icon: BadgePercent,
      title: i18n.t("home.value.curatedTitle"),
      description: i18n.t("home.value.curatedDesc"),
    },
    {
      icon: Headphones,
      title: i18n.t("home.value.easyTitle"),
      description: i18n.t("home.value.easyDesc"),
    },
  ]);
</script>

<section class="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
  <div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:py-14">
    {#each valueProps as item (item.title)}
      {@const Icon = item.icon}
      <div class="text-center">
        <div
          class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
        >
          <Icon size={22} strokeWidth={1.5} class="text-brand" />
        </div>
        <h2
          class="text-base font-semibold uppercase tracking-wide text-neutral-900 dark:text-neutral-50"
        >
          {item.title}
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {item.description}
        </p>
      </div>
    {/each}
  </div>
</section>
