<script lang="ts">
  import type { iSVG } from "@/types/svg";
  import { getSvgImgUrl } from "@/data";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { getSvgLibraryHref } from "@/utils/svgLinks";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
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
      <InternalLink
        href={getSvgLibraryHref(svg)}
        title={svg.title}
        className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 transition-colors hover:border-brand/40 hover:bg-brand/5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-brand/50"
      >
        <img
          src={getSvgImgUrl({ url: svg.route!, isDark })}
          alt={getSvgAltText(svg)}
          class="max-h-10 max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </InternalLink>
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
