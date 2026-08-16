<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import AppBreadcrumbs from "@/components/layout/appBreadcrumbs.svelte";
  import ShowCategories from "@/components/layout/showCategories.svelte";
  import { getAppBreadcrumbs } from "@/utils/breadcrumbs";
  import { stripLocalePrefix } from "@/lib/i18n/paths";
  import { LOCALES } from "@/lib/i18n/config";
  import { getI18n } from "@/lib/i18n/context";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();

  const i18n = $derived(getI18n());
  const breadcrumbs = $derived(
    getAppBreadcrumbs(
      page.url.pathname,
      page.data as Record<string, unknown>,
      i18n.t,
    ),
  );

  const path = $derived(stripLocalePrefix(page.url.pathname, LOCALES));

  const showBreadcrumbs = $derived(breadcrumbs.length > 1 && path !== "/");

  /** Library grids: categories rail + wide content. Trust/docs stay centered. */
  const withCategories = $derived(
    path === "/library" ||
      path.startsWith("/directory") ||
      path === "/browse" ||
      path === "/favorites" ||
      path.startsWith("/tags") ||
      path.startsWith("/icon"),
  );
</script>

{#if withCategories}
  <div class="flex w-full gap-4 px-4 pb-12 sm:px-6 lg:gap-6 lg:px-8">
    <aside
      class="sticky top-16 hidden h-[calc(100vh-4rem)] w-52 shrink-0 overflow-y-auto overscroll-contain py-4 md:block lg:w-56"
    >
      <nav class="flex flex-col gap-y-0.5 pr-1">
        <ShowCategories />
      </nav>
    </aside>
    <div class="min-w-0 flex-1">
      {#if showBreadcrumbs}
        <div class="pt-4">
          <AppBreadcrumbs items={breadcrumbs} />
        </div>
      {/if}
      {@render children()}
    </div>
  </div>
{:else}
  <div class="mx-auto max-w-6xl px-4 pb-12">
    {#if showBreadcrumbs}
      <div class="pt-4">
        <AppBreadcrumbs items={breadcrumbs} />
      </div>
    {/if}
    {@render children()}
  </div>
{/if}
