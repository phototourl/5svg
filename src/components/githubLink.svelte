<script lang="ts">
  import { cn } from "@/utils/cn";
  import { brand } from "@/brand";
  import { buttonVariants } from "@/components/ui/button";
  import Svgl from "@/components/logos/svgl.svelte";
  import InternalLink from "@/components/ui/links/internal-link.svelte";
</script>

<InternalLink
  title={brand.displayName}
  href="/"
  className={cn(
    buttonVariants({ variant: "ghost", size: "icon" }),
    "hover:bg-neutral-200 dark:hover:bg-neutral-800",
  )}
>
  <Svgl size={20} />
</InternalLink>
