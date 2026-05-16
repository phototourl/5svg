<script lang="ts">
  import type { iSVG } from "@/types/svg";

  import { brand } from "@/brand";
  import { globals } from "@/globals";
  import { toast } from "svelte-sonner";
  import { clipboard } from "@/utils/clipboard";

  import { getSource } from "@/templates/getSource";

  import logoStackLight from "@/components/logos/logo_stack_light.png";
  import logoStackDark from "@/components/logos/logo_stack_dark.png";
  import Github from "@/components/logos/github.svelte";
  import * as ContextMenu from "@/components/ui/context-menu";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { siteLogoAlt } from "@/utils/svgAlt";

  import BugIcon from "@lucide/svelte/icons/bug";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";
  import HeartHandshakeIcon from "@lucide/svelte/icons/heart-handshake";

  const svgInfo = {
    title: "5svg",
    category: "Library",
    route: `/library/svgl.svg`,
    url: "https://5svg.com",
  } as iSVG;

  const copySvgToClipboard = async () => {
    let content = await getSource({
      url: svgInfo.route as string,
      optimize: false,
    });

    await clipboard(content);

    const category = Array.isArray(svgInfo.category)
      ? svgInfo.category.sort().join(" - ")
      : svgInfo.category;

    toast.success("Copied SVG to clipboard", {
      description: `${svgInfo.title} - ${category}`,
    });
  };

  const gotoUrl = (url: string) => {
    window.open(url, "_blank");
  };
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    <InternalLink
      href="/"
      className="flex items-center space-x-2 transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
    >
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
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-fit">
    <ContextMenu.Item onclick={() => copySvgToClipboard()}>
      <CopyIcon size={14} />
      <span>Copy SVG</span>
    </ContextMenu.Item>
    {#if brand.showDeveloperTools}
      <ContextMenu.Item
        onclick={() => gotoUrl(`${globals.githubUrl}/issues/new/choose`)}
      >
        <BugIcon size={14} />
        <span>Create Issue</span>
        <ArrowUpRight size={14} />
      </ContextMenu.Item>
      {#if globals.enableSubmit}
        <ContextMenu.Item onclick={() => gotoUrl(globals.submitUrl)}>
          <HeartHandshakeIcon size={14} />
          <span>Contribute</span>
          <ArrowUpRight size={14} />
        </ContextMenu.Item>
      {/if}
      <ContextMenu.Item onclick={() => gotoUrl(globals.githubUrl)}>
        <Github size={14} />
        <span>GitHub Repository</span>
        <ArrowUpRight size={14} />
      </ContextMenu.Item>
    {/if}
  </ContextMenu.Content>
</ContextMenu.Root>
