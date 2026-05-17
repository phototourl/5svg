<script lang="ts">
  import { formatSiteLastUpdated, siteLastUpdated } from "@/config/site-freshness";

  interface Props {
    className?: string;
  }

  let { className = "" }: Props = $props();

  const formatted = formatSiteLastUpdated();
</script>

<p class={className}>
  <time datetime={siteLastUpdated}>Last updated: {formatted}</time>
</p>
