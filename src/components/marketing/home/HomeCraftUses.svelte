<script lang="ts">
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());

  const craftUses = $derived([
    { icon: "/marketing/craft/scissors.svg", label: i18n.t("home.craft.cutting") },
    { icon: "/marketing/craft/sparkles.svg", label: i18n.t("home.craft.stickers") },
    { icon: "/marketing/craft/gift.svg", label: i18n.t("home.craft.gifts") },
    { icon: "/marketing/craft/tag.svg", label: i18n.t("home.craft.labels") },
    { icon: "/marketing/craft/photo.svg", label: i18n.t("home.craft.print") },
    { icon: "/marketing/craft/heart.svg", label: i18n.t("home.craft.personal") },
  ]);
</script>

<section class="mx-auto max-w-6xl px-4 py-12 md:py-14">
  <h2
    class="text-center text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50"
  >
    {i18n.t("home.craft.title")}
  </h2>
  <p class="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
    {i18n.t("home.craft.subtitle")}
  </p>
  <div class="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
    {#each craftUses as item (item.label)}
      <div
        class="flex flex-col items-center rounded-xl border border-neutral-200 bg-white px-4 py-6 text-center dark:border-neutral-800 dark:bg-neutral-900"
      >
        <img
          src={item.icon}
          alt={i18n.t("home.craft.iconAlt", { label: item.label })}
          class="size-10 text-neutral-900 dark:invert"
          loading="lazy"
        />
        <p class="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {item.label}
        </p>
      </div>
    {/each}
  </div>
</section>
