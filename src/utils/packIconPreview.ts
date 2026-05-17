import { cn } from "@/utils/cn";

/** Paths that are full-color brand assets — do not invert in dark mode. */
const COLOR_PREVIEW_SEGMENTS = [
  "/brands/",
  "/simple-icons/",
  "/flat-color-icons/",
  "/emoji/",
  "/flag-icons/",
] as const;

export function isPackIconColorPreview(path: string): boolean {
  return COLOR_PREVIEW_SEGMENTS.some((segment) => path.includes(segment));
}

export function packIconPreviewFrameClass(path: string): string {
  return cn(
    "mb-3 flex h-12 w-full max-w-[88%] items-center justify-center",
    isPackIconColorPreview(path) &&
      "rounded-md bg-neutral-50 px-2 py-1.5 dark:bg-white dark:shadow-sm",
  );
}

export function packIconPreviewImageClass(path: string): string {
  return cn(
    "h-8 w-full max-w-full object-contain select-none",
    !isPackIconColorPreview(path) && "dark:brightness-0 dark:invert",
  );
}
