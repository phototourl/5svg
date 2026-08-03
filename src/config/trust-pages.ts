/** Trust / legal pages (E-E-A-T). */

export const aboutPage = {
  title: "About 5SVG — Free SVG Logo & Icon Library",
  description:
    "5SVG is an independent free SVG library of brand logos and icons for crafts, design, and the web. Learn how the library works and how to use files responsibly.",
  h1: "About 5SVG",
  sections: [
    {
      h2: "What we offer",
      body: "5SVG hosts a curated library of free SVG brand logos and icons. Browse, search, copy SVG code, or download files — no account required.",
    },
    {
      h2: "Who we are",
      body: "5SVG is an independent project focused on fast access to production-ready vector files. We are not affiliated with, endorsed by, or sponsored by the brands whose logos appear in the library.",
    },
    {
      h2: "How to use the site",
      body: "Start on the library page or pick a category. Save favorites in your browser, and read our License page before commercial use of any trademarked logo.",
    },
  ],
} as const;

export const licensePage = {
  title: "License & Trademark Notice — 5SVG",
  description:
    "How to use SVG files from 5SVG: site terms and trademark guidelines for brand logos.",
  h1: "License & trademarks",
  sections: [
    {
      h2: "Main library (brand logos)",
      body: "Logos and wordmarks are trademarks of their respective owners. 5SVG provides files for personal projects, education, and mockups. Commercial use may require permission from the rights holder — always check each brand’s official brand guidelines.",
    },
    {
      h2: "No warranty",
      body: "Files are provided as-is. We do not guarantee completeness, legal clearance for your use case, or that assets match the latest official brand versions.",
    },
  ],
} as const;

export const privacyPage = {
  title: "Privacy Policy — 5SVG",
  description:
    "How 5SVG handles analytics, local browser storage for favorites, and third-party embeds.",
  h1: "Privacy policy",
  sections: [
    {
      h2: "Data we collect",
      body: "We may use privacy-friendly analytics (such as Google Analytics) to understand traffic and improve the site. Favorites are stored locally in your browser only — we do not receive your saved list on our servers.",
    },
    {
      h2: "Cookies & storage",
      body: "The site may use cookies or local storage for theme preference, favorites, and analytics. You can clear site data in your browser settings at any time.",
    },
    {
      h2: "Third parties",
      body: "Outbound links (brand sites, documentation, directory badges) are governed by those sites’ policies. Embedded badges or widgets on the homepage footer load resources from third-party domains.",
    },
    {
      h2: "Contact",
      body: "For privacy questions, open an issue on our public GitHub repository linked from the site footer.",
    },
  ],
} as const;
