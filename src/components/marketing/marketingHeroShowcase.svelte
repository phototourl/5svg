<script lang="ts">
  import { browser } from "$app/environment";
  import type { Category } from "@/types/categories";
  import {
    getSvgImgUrl,
    getHeroPreviewSvgs,
    getFamousBrandPreviewSvgs,
    getCategoryPreviewSvgs,
    sampleSvgs,
  } from "@/data";
  import { cn } from "@/utils/cn";
  import { getSvgAltText } from "@/utils/svgAlt";
  import { mode } from "mode-watcher";
  import * as Tabs from "@/components/ui/tabs";
  const TAB_ROTATE_MS = 4500;

  const GRID_COUNT = 12;

  type HeroTab = {
    id: string;
    label: string;
    items: ReturnType<typeof getHeroPreviewSvgs>;
  };

  const fillToTwelve = (
    primary: ReturnType<typeof getHeroPreviewSvgs>,
    fallbackOffset: number,
  ) => {
    if (primary.length >= GRID_COUNT) return primary.slice(0, GRID_COUNT);
    const extra = sampleSvgs(GRID_COUNT - primary.length, fallbackOffset);
    return [...primary, ...extra].slice(0, GRID_COUNT);
  };

  const heroTabs: HeroTab[] = [
    {
      id: "brands",
      label: "Brands",
      items: fillToTwelve(getFamousBrandPreviewSvgs(GRID_COUNT), 1),
    },
    {
      id: "browse",
      label: "Browse",
      items: getHeroPreviewSvgs(GRID_COUNT),
    },
    {
      id: "ai",
      label: "AI",
      items: fillToTwelve(getCategoryPreviewSvgs("AI" as Category, GRID_COUNT), 2),
    },
    {
      id: "design",
      label: "Design",
      items: fillToTwelve(getCategoryPreviewSvgs("Design" as Category, GRID_COUNT), 4),
    },
    {
      id: "social",
      label: "Social",
      items: fillToTwelve(getCategoryPreviewSvgs("Social" as Category, GRID_COUNT), 6),
    },
  ];

  let activeTab = $state(heroTabs[0]!.id);
  let paused = $state(false);
  const isDark = $derived(mode.current === "dark");

  const advanceTab = () => {
    const index = heroTabs.findIndex((tab) => tab.id === activeTab);
    const next = heroTabs[(index + 1) % heroTabs.length]!;
    activeTab = next.id;
  };

  $effect(() => {
    if (!browser || paused) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timer = window.setInterval(advanceTab, TAB_ROTATE_MS);
    return () => window.clearInterval(timer);
  });
</script>

<div
  class="w-full md:justify-self-end"
  role="region"
  aria-label="Logo previews"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={(event) => {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
      paused = false;
    }
  }}
>
  <Tabs.Root bind:value={activeTab} class="gap-3">
    <Tabs.List
      class="h-auto w-full justify-start gap-0 rounded-none border-0 border-b border-neutral-200 bg-transparent p-0 dark:border-neutral-800"
    >
      {#each heroTabs as tab (tab.id)}
        <Tabs.Trigger
          value={tab.id}
          class={cn(
            "rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-neutral-500 shadow-none",
            "hover:bg-transparent hover:text-neutral-900",
            "data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none",
            "dark:hover:text-neutral-100 dark:data-[state=active]:text-neutral-50",
          )}
        >
          {tab.label}
        </Tabs.Trigger>
      {/each}
    </Tabs.List>

    {#each heroTabs as tab (tab.id)}
      <Tabs.Content value={tab.id} class="mt-0 outline-none">
        <div
          class="grid grid-cols-4 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        >
          {#each tab.items as svg (`${tab.id}-${svg.id}`)}
            <div
              class="flex aspect-square items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-900"
              title={svg.title}
            >
              <img
                src={getSvgImgUrl({ url: svg.route!, isDark })}
                alt={getSvgAltText(svg)}
                class="max-h-full max-w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </div>
          {/each}
        </div>
      </Tabs.Content>
    {/each}
  </Tabs.Root>
</div>
