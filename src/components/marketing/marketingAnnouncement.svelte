<script lang="ts">
  import { svgsData } from "@/data";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getI18n } from "@/lib/i18n/context";

  const i18n = $derived(getI18n());
</script>

<div
  class="flex flex-col text-center text-xs font-bold uppercase tracking-[0.15em] md:flex-row md:text-sm"
>
  <InternalLink
    href="/library"
    className="flex-1 bg-brand-energy px-4 py-2.5 text-brand-energy-foreground transition-colors hover:bg-brand-energy-hover"
  >
    {i18n.t("common.announcement.library", { count: svgsData.length })}
  </InternalLink>
  <InternalLink
    href="/favorites"
    className="flex-1 bg-brand px-4 py-2.5 text-brand-foreground transition-colors hover:bg-brand-hover"
  >
    {i18n.t("common.announcement.favorites")}
  </InternalLink>
</div>
