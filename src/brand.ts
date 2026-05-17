/**
 * 5SVG — Green + Brown (8svg-style twin bars + signature band).
 * Green = primary accent. Brown = structure & secondary.
 */
export const brandColors = {
  /** Forest green — section band, primary CTA, promo */
  primary: "#15803D",
  primaryHover: "#166534",
  primaryForeground: "#FFFFFF",
  /** Coffee brown — twin bar, secondary actions */
  brown: "#5C4033",
  brownHover: "#4A3728",
  brownForeground: "#FFFFFF",
  /** Tailwind `brand-energy` = brown */
  energy: "#5C4033",
  energyHover: "#4A3728",
  energyForeground: "#FFFFFF",
  paper: "#FFFFFF",
  surface: "#FFFFFF",
  border: "#E7E5E4",
  muted: "#F5F5F4",
} as const;

/** Site & product branding (5svg.com) */
export const brand = {
  name: "5svg",
  displayName: "5SVG",
  colors: brandColors,
  tagline:
    "Free SVG files, logos & icons for crafts, design, and everyday projects — browse, download, and save your favorites.",
  siteUrl: "https://5svg.com",
  githubUrl: "https://github.com/phototourl/5svg",
  githubRepoGit: "https://github.com/phototourl/5svg.git",
  showApiNav: true,
  showDeveloperTools: false,
  copyrightRights: "All rights reserved.",
  copyrightDisclaimer:
    "Logos and brand assets are trademarks of their respective owners. 5SVG is an independent library and is not affiliated with or endorsed by those brands.",
} as const;
