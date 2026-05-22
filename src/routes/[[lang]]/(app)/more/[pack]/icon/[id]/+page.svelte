<script lang="ts">
  import type { PageProps } from "./$types";
  import { cn } from "@/utils/cn";
  import {
    packIconPreviewFrameClass,
    packIconPreviewImageClass,
  } from "@/utils/packIconPreview";
  import { clipboard } from "@/utils/clipboard";
  import { getSource } from "@/templates/getSource";
  import { optimizeSvg } from "@/utils/optimizeSvg";

  import Container from "@/components/container.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { Button } from "@/components/ui/button";
  import CopyIcon from "@lucide/svelte/icons/copy";
  import DownloadIcon from "@lucide/svelte/icons/download";
  import { toast } from "svelte-sonner";
  let { data }: PageProps = $props();

  let copying = $state(false);

  const copySvg = async () => {
    copying = true;
    try {
      const raw = await getSource({ url: data.icon.path, optimize: false });
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
    anchor.href = data.icon.path;
    anchor.download = `${data.icon.id}.svg`;
    anchor.click();
  };
</script>

<Container className="my-6 max-w-3xl">
  <header class="mb-6">
    <p class="text-xs font-medium uppercase tracking-wide text-neutral-500">
      {data.pack.name}
    </p>
    <h1 class="mt-1 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
      {data.seo.h1}
    </h1>
    <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{data.seo.lead}</p>
    <p class="mt-2 text-xs text-neutral-500">
      License: {data.pack.license}
      <InternalLink href="/license" className="ml-1 text-brand-energy dark:text-brand">
        Details
      </InternalLink>
    </p>
  </header>

  <div
    class={cn(
      "flex flex-col items-center rounded-md border border-neutral-200 p-8 dark:border-neutral-800",
    )}
  >
    <div class={packIconPreviewFrameClass(data.icon.path)}>
      <img
        src={data.icon.path}
        alt={data.icon.title}
        class={cn(packIconPreviewImageClass(data.icon.path), "max-h-24")}
        width="160"
        height="96"
        loading="eager"
      />
    </div>
    <div class="mt-6 flex gap-2">
      <Button variant="outline" size="sm" disabled={copying} onclick={copySvg}>
        <CopyIcon size={16} />
        Copy SVG
      </Button>
      <Button variant="outline" size="sm" onclick={downloadSvg}>
        <DownloadIcon size={16} />
        Download
      </Button>
    </div>
  </div>

  <p class="mt-8 text-center text-sm">
    <InternalLink
      href={`/more/${data.pack.id}`}
      className="font-medium text-brand-energy dark:text-brand"
    >
      ← Back to {data.pack.name}
    </InternalLink>
  </p>
</Container>
