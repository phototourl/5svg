<script lang="ts">
  import { globals } from "@/globals";

  import { buttonVariants } from "@/components/ui/button";
  import SearchIcon from "@lucide/svelte/icons/search";
  import ArrowUpRight from "@lucide/svelte/icons/arrow-up-right";

  import BoxesIcon from "@/components/ui/moving-icons/boxes-icon.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import ExternalLink from "@/components/ui/links/external-link.svelte";
  import { getI18n } from "@/lib/i18n/context";

  interface Props {
    svgTitle: string;
    category?: string;
    searchGlobally?: boolean;
  }

  let { svgTitle, category, searchGlobally }: Props = $props();
  const i18n = $derived(getI18n());
</script>

<div class="flex w-full flex-col items-center justify-center space-y-4 py-6">
  <BoxesIcon size={48} strokeWidth={1} />
  <h2 class="text-xl font-semibold">{i18n.t("NotFound.title")}</h2>
  {#if category}
    <p class="text-neutral-600 dark:text-neutral-400">
      {i18n.t("NotFound.inCategory", { title: svgTitle, category })}
    </p>
  {:else}
    <p class="text-neutral-600 dark:text-neutral-400">
      {i18n.t("NotFound.plain", { title: svgTitle })}
    </p>
  {/if}
  <div class="flex items-center justify-center space-x-2">
    {#if category || searchGlobally}
      <InternalLink
        href={`/?search=${svgTitle}`}
        className={buttonVariants({ variant: "outline" })}
      >
        <SearchIcon size={14} strokeWidth={1.5} />
        <span>{i18n.t("NotFound.searchGlobally")}</span>
      </InternalLink>
    {/if}
    <ExternalLink
      href={globals.requestSvgUrl}
      className={buttonVariants({ variant: "outline" })}
    >
      <span>{i18n.t("NotFound.requestSvg")}</span>
      <ArrowUpRight size={14} strokeWidth={1.5} />
    </ExternalLink>
    {#if globals.enableSubmit}
      <ExternalLink
        href={globals.submitUrl}
        className={buttonVariants({ variant: "outline" })}
      >
        <span>{i18n.t("NotFound.submitSvg")}</span>
        <ArrowUpRight size={14} strokeWidth={1.5} />
      </ExternalLink>
    {/if}
  </div>
</div>
