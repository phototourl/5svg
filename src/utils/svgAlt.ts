import type { iSVG } from "@/types/svg";

/** Descriptive alt text for logo/SVG images (accessibility + SEO). */
export function getSvgAltText(
  svg: Pick<iSVG, "title">,
  variant: "logo" | "wordmark" = "logo",
): string {
  const name = svg.title?.trim() || "Brand";
  if (variant === "wordmark") {
    return `${name} wordmark logo — free SVG`;
  }
  return `${name} logo — free SVG download`;
}

export const siteLogoAlt = "5SVG logo";
