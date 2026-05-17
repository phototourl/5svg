<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import Sidebar from "@/components/layout/sidebar.svelte";
  import AppBreadcrumbs from "@/components/layout/appBreadcrumbs.svelte";
  import { getAppBreadcrumbs } from "@/utils/breadcrumbs";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const breadcrumbs = $derived(
    getAppBreadcrumbs(page.url.pathname, page.data as Record<string, unknown>),
  );

  const showBreadcrumbs = $derived(
    breadcrumbs.length > 1 && page.url.pathname !== "/",
  );
</script>

<Sidebar>
  {#if showBreadcrumbs}
    <div class="px-4 pt-3 md:px-2">
      <AppBreadcrumbs items={breadcrumbs} />
    </div>
  {/if}
  {@render children()}
</Sidebar>
