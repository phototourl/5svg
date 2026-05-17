import type { Category } from "@/types/categories";

export type TagPageDef = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  lead: string;
  /** When set, grid shows logos from this library category. */
  category?: Category;
};

/** SEO tag / topic landing pages → `/tags/{slug}` */
export const tagPages = [
  {
    slug: "social-icons",
    title: "Social Media SVG Icons & Logos — Free Download | 5SVG",
    h1: "Social media SVG icons",
    description:
      "Free SVG logos for social networks and communities — Twitter, Discord, Instagram, and more. Copy or download vector files.",
    lead: "Brand logos for social platforms in scalable SVG format. Browse, copy markup, or download for design and crafts.",
    category: "Social",
  },
  {
    slug: "ai-logos",
    title: "AI Brand SVG Logos — Free Vector Icons | 5SVG",
    h1: "AI brand SVG logos",
    description:
      "Free SVG logos for AI companies and tools — OpenAI, NVIDIA, Anthropic, and more. Download vector files for mockups and projects.",
    lead: "Vector logos for AI platforms and developer tools. Search the grid or open any logo for copy and download options.",
    category: "AI",
  },
  {
    slug: "design-icons",
    title: "Design Tool SVG Logos — Figma, Adobe & More | 5SVG",
    h1: "Design tool SVG logos",
    description:
      "Free SVG logos for design software and creative tools. Figma, Adobe, Canva-ready vector brand marks.",
    lead: "Logos for design apps and creative workflows — resize without quality loss for UI, slides, and print.",
    category: "Design",
  },
  {
    slug: "software-logos",
    title: "Software Brand SVG Logos — Free Download | 5SVG",
    h1: "Software brand SVG logos",
    description:
      "Free SVG logos for software companies and developer products. Browse by name and download production-ready vectors.",
    lead: "From devtools to platforms — find recognizable software logos as SVG files.",
    category: "Software",
  },
  {
    slug: "google-logos",
    title: "Google Brand SVG Logos — Free Vector Files | 5SVG",
    h1: "Google brand SVG logos",
    description:
      "Free SVG logos for Google products and services — Classroom, Drive, and related brand assets in vector format.",
    lead: "Google family brand marks for education, productivity, and design mockups.",
    category: "Google",
  },
  {
    slug: "cricut-svg",
    title: "Cricut SVG Logos & Icons — Free Brand Vectors | 5SVG",
    h1: "Cricut-ready SVG logos",
    description:
      "Free brand SVG files for Cricut Design Space and vinyl crafts. Download logos, resize cleanly, and cut without pixelation.",
    lead: "Import SVGs into Cricut or Silhouette for decals, shirts, and party crafts. Trademarks belong to their owners — personal use only.",
  },
  {
    slug: "brand-logos",
    title: "Free Brand Logo SVG Files — Download Vectors | 5SVG",
    h1: "Free brand logo SVGs",
    description:
      "Hundreds of free brand logo SVG files in one library. Search by name, browse A–Z, or open a logo detail page to copy or download.",
    lead: "Production-ready vector logos for mockups, school projects, and personal crafts — no signup required.",
  },
] as const satisfies readonly TagPageDef[];

export type TagSlug = (typeof tagPages)[number]["slug"];

export const tagPageBySlug = Object.fromEntries(
  tagPages.map((tag) => [tag.slug, tag]),
) as Record<TagSlug, TagPageDef>;

export function isTagSlug(value: string): value is TagSlug {
  return value in tagPageBySlug;
}

export function getTagPaths(): string[] {
  return tagPages.map((tag) => `/tags/${tag.slug}`);
}
