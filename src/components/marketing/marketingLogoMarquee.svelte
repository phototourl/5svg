<script lang="ts">
  import type { iSVG } from "@/types/svg";
  import { getSvgImgUrl } from "@/data";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { mode } from "mode-watcher";
  interface Props {
    items: iSVG[];
    reverse?: boolean;
    duration?: string;
    class?: string;
  }

  let { items, reverse = false, duration = "45s", class: className = "" }: Props = $props();

  const isDark = $derived(mode.current === "dark");
  const track = $derived([...items, ...items]);
</script>

<div
  class="overflow-hidden {className}"
  style:--marquee-duration={duration}
>
  <div
    class="marketing-marquee-track flex w-max items-center gap-3 py-1 {reverse
      ? 'marketing-marquee-track--reverse'
      : ''}"
  >
    {#each track as svg, index (`${svg.id}-${svg.title}-${index}`)}
      <div
        class="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900"
        title={svg.title}
      >
        <img
          src={getSvgImgUrl({ url: svg.route!, isDark })}
          alt={getSvgAltText(svg)}
          class="max-h-10 max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    {/each}
  </div>
</div>

<style>
  @keyframes marketing-marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .marketing-marquee-track {
    animation: marketing-marquee var(--marquee-duration, 45s) linear infinite;
    will-change: transform;
  }

  .marketing-marquee-track--reverse {
    animation-direction: reverse;
  }

  @media (hover: hover) and (pointer: fine) {
    .marketing-marquee-track:hover {
      animation-play-state: paused;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .marketing-marquee-track {
      animation: none;
    }
  }
</style>
