<script lang="ts">
  import { svgsData } from "@/data";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
  import { getI18n } from "@/lib/i18n/context";
  import { isShopEnabled } from "@/lib/shop";

  const i18n = $derived(getI18n());
  const shopOn = isShopEnabled();

  // Twin promo bars: same fixed height, short copy (no truncate / ellipsis)
  const barClass =
    "flex h-10 w-full shrink-0 items-center justify-center px-3 text-center text-[11px] leading-none tracking-[0.08em] whitespace-nowrap transition-colors sm:px-4 sm:text-xs sm:tracking-[0.1em] md:h-11 md:flex-1 md:text-sm";
</script>

<div
  class="flex flex-col text-center font-bold uppercase md:flex-row md:items-stretch"
>
  <InternalLink
    href="/library"
    className={`${barClass} bg-brand-energy text-brand-energy-foreground hover:bg-brand-energy-hover ${shopOn ? "" : "md:flex-none"}`}
  >
    {i18n.t("common.announcement.library", { count: svgsData.length })}
  </InternalLink>
  {#if shopOn}
    <InternalLink
      href="/shop"
      className={`${barClass} bg-brand text-brand-foreground hover:bg-brand-hover`}
    >
      {i18n.t("common.announcement.shop")}
    </InternalLink>
  {/if}
</div>
