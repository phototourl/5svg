<script lang="ts">
  import type { PackIcon } from "@/types/icon-pack";

  import { cn } from "@/utils/cn";
  import {
    packIconPreviewFrameClass,
    packIconPreviewImageClass,
  } from "@/utils/packIconPreview";
  import { clipboard } from "@/utils/clipboard";
  import { getSource } from "@/templates/getSource";
  import { optimizeSvg } from "@/utils/optimizeSvg";

  import CopyIcon from "@lucide/svelte/icons/copy";
  import DownloadIcon from "@lucide/svelte/icons/download";
  import { toast } from "svelte-sonner";
  import Button from "@/components/ui/button/button.svelte";

  interface Props {
    icon: PackIcon;
  }

  let { icon }: Props = $props();

  let copying = $state(false);

  const copySvg = async () => {
    copying = true;
    try {
      const raw = await getSource({ url: icon.path, optimize: false });
      const content = optimizeSvg({ svgCode: raw });
      await clipboard(content);
      toast.success("Copied SVG to clipboard");
    } catch {
      toast.error("Could not copy SVG");
    } finally {
      copying = false;
    }
  };

  const downloadSvg = () => {
    const anchor = document.createElement("a");
    anchor.href = icon.path;
    anchor.download = `${icon.id}.svg`;
    anchor.click();
  };
</script>

<div
  class={cn(
    "flex flex-col items-center justify-center px-3.5 py-3",
    "rounded-md border border-neutral-200 dark:border-neutral-800",
    "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/20",
  )}
>
  <div class={packIconPreviewFrameClass(icon.path)}>
    <img
      src={icon.path}
      alt={icon.title}
      class={packIconPreviewImageClass(icon.path)}
      loading="lazy"
      decoding="async"
    />
  </div>
  <p class="mb-2 line-clamp-2 w-full text-center text-xs text-neutral-600 dark:text-neutral-400">
    {icon.title}
  </p>
  <div class="flex w-full gap-1">
    <Button
      variant="outline"
      size="sm"
      class="h-8 flex-1 text-xs"
      disabled={copying}
      onclick={copySvg}
    >
      <CopyIcon size={14} class="mr-1" />
      Copy
    </Button>
    <Button variant="outline" size="sm" class="h-8 flex-1 text-xs" onclick={downloadSvg}>
      <DownloadIcon size={14} class="mr-1" />
      Save
    </Button>
  </div>
  </div>
