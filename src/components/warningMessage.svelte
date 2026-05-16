<script lang="ts">
  import { cn } from "@/utils/cn";
  import Button from "@/components/ui/button/button.svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";

  import { warningStore, acceptWarning } from "@/stores/warning.store";
</script>

{#if !$warningStore}
  <div
    class={cn(
      "flex w-full flex-col items-center justify-between space-y-2 px-3 py-4 text-sm md:flex-row md:space-y-0 md:space-x-2 md:py-2",
      "bg-white dark:bg-neutral-900",
      "border-b border-neutral-200 dark:border-neutral-800",
    )}
  >
    <div class="flex flex-col items-center gap-2 md:flex-row">
      <AlertTriangleIcon
        size={18}
        strokeWidth={2}
        class="shrink-0 animate-pulse text-yellow-600 dark:text-yellow-500"
      />
      <p>
        SVG assets are provided for reference. You are responsible for
        verifying trademark and usage rights before using them in your projects.
      </p>
    </div>
    <Button size="sm" onclick={acceptWarning}>
      <CheckIcon size={14} strokeWidth={2} />
      <span>Accept</span>
    </Button>
  </div>
{/if}
