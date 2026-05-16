<script lang="ts">
  import type { Snippet } from "svelte";
  import Sidebar from "@/components/layout/sidebar.svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Sidebar>
  {@render children()}
</Sidebar>
