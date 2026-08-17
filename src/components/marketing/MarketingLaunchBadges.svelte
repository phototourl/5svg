<script lang="ts">
  import { LAUNCH_BADGES } from "@/config/launch-badges";
</script>

{#snippet badgeGroup(ariaHidden?: boolean)}
  <div
    class="flex w-max flex-nowrap items-center gap-3 pr-3"
    aria-hidden={ariaHidden || undefined}
  >
    {#each LAUNCH_BADGES as badge (badge.href + (ariaHidden ? "-dup" : ""))}
      <a
        href={badge.href}
        target="_blank"
        rel={badge.rel ?? "noopener noreferrer"}
        class="inline-block shrink-0 transition-transform hover:scale-105"
        tabindex={ariaHidden ? -1 : undefined}
      >
        <img
          src={badge.imgSrc}
          width={badge.width}
          height={badge.height ?? 54}
          alt={ariaHidden ? "" : badge.alt}
          class="h-6 w-auto shrink-0 {badge.imgClass ?? ""}"
          loading="lazy"
          decoding="async"
        />
      </a>
    {/each}
  </div>
{/snippet}

<div role="region" aria-label="Partner badges">
  <!-- Mobile: EditStamp-style infinite marquee -->
  <div class="overflow-hidden border-t border-neutral-200 px-4 py-6 md:hidden dark:border-neutral-800">
    <div class="svg-badge-marquee-track">
      {@render badgeGroup()}
      {@render badgeGroup(true)}
    </div>
  </div>

  <!-- Desktop: single static row, no wrap / no scroll -->
  <div
    class="hidden overflow-hidden border-t border-neutral-200 px-4 py-6 md:block dark:border-neutral-800"
  >
    <div class="flex justify-center">
      {@render badgeGroup()}
    </div>
  </div>
</div>
