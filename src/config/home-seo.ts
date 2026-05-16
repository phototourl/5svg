/** Homepage SEO & educational copy — informational, not link-heavy. */

export const homeSeoMeta = {

  keywords: [
    "free svg files",
    "free svg download",
    "svg library",
    "brand logo svg",
    "cricut svg",
    "silhouette svg",
    "canva",
  ].join(", "),

} as const;



export const homeSeoIntro = {

  tag: "About SVG",

  title: "Free vector graphics for crafts, design, and everyday projects",

  description:

    "5SVG is a free online library of SVG icons and brand logos. Learn what SVG files are, what you can make with them, and how to browse and download — no account required.",

} as const;



export type HomeSeoBlock = {

  id: string;

  tag: string;

  title: string;

  body: string;

  bullets: readonly string[];

  /** Optional library previews (display only) */

  visualBrands?: readonly string[];

  reverse?: boolean;

};



export const homeSeoBlocks: readonly HomeSeoBlock[] = [

  {

    id: "what",

    tag: "Basics",

    title: "What is an SVG file?",

    body: "SVG (Scalable Vector Graphics) stores shapes and paths as math instead of pixels. That means logos and icons stay crisp whether you shrink them for a sticker or enlarge them for a poster.",

    bullets: [

      "Scales to any size without getting blurry",

      "Common format for logos, icons, and simple illustrations",

      "Supported by browsers, design software, and vinyl cutters",

    ],

    visualBrands: ["GitHub", "NVIDIA", "Stripe", "Figma"],

  },

  {

    id: "uses",

    tag: "Uses",

    title: "What can you do with SVG files?",

    body: "SVGs are a practical starting point for personal projects — mockups, learning design, party crafts, and maker workflows where you need a clean vector you can resize.",

    bullets: [

      "Cut vinyl decals with Cricut or Silhouette",

      "Drop icons into Canva, Figma, or PowerPoint",

      "Print shirts, tags, and party decorations at home",

      "Build mood boards and school projects with real brand logos",

    ],

    visualBrands: ["Spotify", "YouTube", "Apple", "Notion"],

    reverse: true,

  },

  {

    id: "get",

    tag: "Get files",

    title: "How to get SVG files from 5SVG",

    body: "Everything in the library is free to browse. Open the library from the menu, search by name or pick a category, then copy or download the SVG file to your device.",

    bullets: [

      "Browse or search — no signup required",

      "Click a logo to copy SVG code or download the file",

      "Use the heart icon to save favorites on this device",

      "Check each brand’s official guidelines before commercial use",

    ],

    visualBrands: ["OpenAI", "Vercel", "Discord", "Tailwind CSS"],

  },

] as const;



export const homeSeoFaqSection = {
  title: "Common questions",
  subtitle: "SVG basics, downloads, and how the library works.",
  lead:
    "5SVG is built for quick browsing: search thousands of logos, open a file, and download or copy SVG in one click. Everything below is free — no account, no paywall.",
} as const;

export const homeSeoFaq = [
  {
    question: "Are SVG files on 5SVG free?",
    answer:
      "Yes. Browse, search, and download at no cost. Logos and trademarks belong to their owners — use them responsibly for personal, educational, and mockup work.",
  },
  {
    question: "What is the difference between SVG and PNG?",
    answer:
      "PNG is pixel-based and can look soft when enlarged. SVG is vector-based and stays sharp at any size — better for logos, icons, and cutting machines.",
  },
  {
    question: "Can I use these SVGs with Cricut or Silhouette?",
    answer:
      "Yes. Download the SVG, then import it into Cricut Design Space, Silhouette Studio, or any app that accepts vector files.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Browse and download without signing up. Favorites are stored locally in your browser on this device.",
  },
] as const;


