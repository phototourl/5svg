<script lang="ts">
  import { page } from "$app/state";
  import { cn } from "@/utils/cn";

  import * as Sheet from "@/components/ui/sheet";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { buttonVariants } from "@/components/ui/button";
  import Separator from "@/components/ui/separator/separator.svelte";

  import MenuIcon from "@lucide/svelte/icons/menu";
  import logoStackLight from "@/components/logos/logo_stack_light.png";
  import logoStackDark from "@/components/logos/logo_stack_dark.png";
  import { siteLogoAlt } from "@/utils/svgAlt";

  import ShowCategories from "@/components/layout/showCategories.svelte";
  import ShowSidebarLinks from "@/components/layout/showSidebarLinks.svelte";
  import ScrollArea from "@/components/ui/scroll-area/scroll-area.svelte";

  interface Props {
    className?: string;
  }

  let { className }: Props = $props();

  let open = $state(false);

  /** Close drawer after navigation so the tap feels responsive */
  $effect(() => {
    void page.url.pathname;
    open = false;
  });
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger
    title="Open 5svg menu"
    class={cn(buttonVariants({ variant: "ghost", size: "icon" }), className)}
  >
    <MenuIcon class="size-5" />
    <span class="sr-only">Open Menu</span>
  </Sheet.Trigger>
  <Sheet.Content class="gap-0.5" side="left">
    <Sheet.Header>
      <Sheet.Title>
        <InternalLink href="/library" className="flex items-center space-x-2">
        <span class="inline-flex h-10 w-11 shrink-0 items-center justify-center overflow-visible">
          <img
            src={logoStackLight}
            alt={siteLogoAlt}
            width={80}
            height={80}
            class="h-10 w-10 origin-center scale-[1.75] object-contain dark:hidden"
            decoding="async"
          />
          <img
            src={logoStackDark}
            alt={siteLogoAlt}
            aria-hidden="true"
            width={80}
            height={80}
            class="hidden h-10 w-10 origin-center scale-[1.75] object-contain dark:block"
            decoding="async"
          />
        </span>
        <h2 class="text-xl font-medium tracking-tight">5svg</h2>
        </InternalLink>
      </Sheet.Title>
    </Sheet.Header>
    <ScrollArea
      class="flex size-full flex-col"
      viewportClassName="pb-3 px-3 space-y-0.5"
      maskClassName="before:from-white after:from-white dark:before:from-neutral-900 dark:after:from-neutral-900"
    >
      <ShowSidebarLinks />
      <Separator orientation="horizontal" class="my-3" />
      <ShowCategories />
    </ScrollArea>
  </Sheet.Content>
</Sheet.Root>
