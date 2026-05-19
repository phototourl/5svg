<script lang="ts">
  import type { ThemeOptions } from "@/types/svg";
  import { cn } from "@/utils/cn";

  interface Props {
    route: string | ThemeOptions;
    alt: string;
    class?: string;
    loading?: "lazy" | "eager";
    height?: number | string;
  }

  let { route, alt, class: className, loading = "lazy", height }: Props = $props();
</script>

{#if typeof route === "string"}
  <img src={route} {alt} class={cn(className)} {loading} {height} decoding="async" />
{:else}
  <img
    src={route.light}
    {alt}
    class={cn("block dark:hidden", className)}
    {loading}
    {height}
    decoding="async"
  />
  <img
    src={route.dark}
    {alt}
    class={cn("hidden dark:block", className)}
    {loading}
    {height}
    decoding="async"
  />
{/if}
