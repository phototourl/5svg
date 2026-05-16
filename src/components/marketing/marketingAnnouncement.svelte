<script lang="ts">
  import { svgsData } from "@/data";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
</script>

<!-- 8svg-style: brown | green -->
<div
  class="flex flex-col text-center text-xs font-bold uppercase tracking-[0.15em] md:flex-row md:text-sm"
>
  <InternalLink
    href="/library"
    className="flex-1 bg-brand-energy px-4 py-2.5 text-brand-energy-foreground transition-colors hover:bg-brand-energy-hover"
  >
    {svgsData.length}+ free SVG logos — browse the library
  </InternalLink>
  <InternalLink
    href="/favorites"
    className="flex-1 bg-brand px-4 py-2.5 text-brand-foreground transition-colors hover:bg-brand-hover"
  >
    Download · save favorites · free for personal use
  </InternalLink>
</div>
