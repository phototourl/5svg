<script lang="ts">
  import { LAUNCH_BADGES } from "@/config/launch-badges";
</script>

<div
  class="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 px-4 py-6 dark:border-neutral-800"
>
  {#each LAUNCH_BADGES as badge (badge.href)}
    <a
      href={badge.href}
      target="_blank"
      rel={badge.rel ?? "noopener noreferrer"}
      class="inline-block transition-transform hover:scale-105"
    >
      <img
        src={badge.imgSrc}
        width={badge.width}
        height={badge.height ?? 54}
        alt={badge.alt}
        class="h-6 w-auto shrink-0 {badge.imgClass ?? ""}"
        loading="lazy"
        decoding="async"
      />
    </a>
  {/each}
</div>
