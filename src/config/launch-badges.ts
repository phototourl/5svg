export type LaunchBadge = {
  href: string;
  imgSrc: string;
  alt: string;
  width?: number;
  height?: number;
  imgClass?: string;
  rel?: string;
};

/** Directory / launch badges shown in the marketing footer. */
export const LAUNCH_BADGES: LaunchBadge[] = [
  {
    href: "https://www.producthunt.com/products/5svg?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-5svg",
    imgSrc:
      "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1150063&theme=light",
    alt: "5SVG — Free SVG Logo & Icon Library on Product Hunt",
    width: 250,
    height: 54,
  },
  {
    href: "https://fazier.com/launches/5svg.com",
    imgSrc:
      "https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=light",
    alt: "Fazier badge",
    width: 120,
    height: 28,
    imgClass: "opacity-90 transition-opacity hover:opacity-100",
    rel: "noreferrer",
  },
  {
    href: "https://fwfw.app/item/5svg",
    imgSrc: "https://fwfw.app/badge-white.svg",
    alt: "Featured on FWFW",
    width: 250,
    height: 54,
    rel: "noreferrer",
  },
  {
    href: "https://showmebest.ai",
    imgSrc: "https://showmebest.ai/badge/feature-badge-white.webp",
    alt: "Featured on ShowMeBestAI",
    width: 220,
    height: 60,
    rel: "noreferrer",
  },
  {
    href: "https://goodaitools.com/ai/5svg",
    imgSrc: "https://goodaitools.com/assets/images/badge.png",
    alt: "Good AI Tools",
    height: 54,
    rel: "noreferrer",
  },
  {
    href: "https://twelve.tools",
    imgSrc: "https://twelve.tools/badge0-light.svg",
    alt: "Featured on Twelve Tools",
    width: 200,
    height: 54,
    rel: "noreferrer",
  },
  {
    href: "https://wired.business",
    imgSrc: "https://wired.business/badge0-white.svg",
    alt: "Featured on Wired Business",
    width: 200,
    height: 54,
    rel: "noreferrer",
  },
  {
    href: "https://findly.tools/5svg?utm_source=5svg",
    imgSrc: "https://findly.tools/badges/findly-tools-badge-light.svg",
    alt: "Featured on Findly.tools",
    width: 175,
    height: 55,
  },
  {
    href:
      "https://aiagentsdirectory.com/agent/5svg?utm_source=badge&utm_medium=referral&utm_campaign=free_listing&utm_content=5svg",
    imgSrc: "https://aiagentsdirectory.com/featured-badge.svg?v=2024",
    alt: "5SVG - Featured AI Agent on AI Agents Directory",
    width: 200,
    height: 50,
  },
  {
    href: "https://submitaitools.org",
    imgSrc:
      "https://submitaitools.org/static_submitaitools/images/submitaitools.png",
    alt: "Submit AI Tools",
    width: 200,
    height: 60,
    imgClass: "rounded-[10px]",
    rel: "noreferrer",
  },
  {
    href: "https://turbo0.com/item/5svg",
    imgSrc: "https://img.turbo0.com/badge-listed-light.svg",
    alt: "Listed on Turbo0",
    height: 54,
  },
  {
    href: "https://dofollow.tools",
    imgSrc: "https://dofollow.tools/badge/badge_light.svg",
    alt: "Featured on Dofollow.Tools",
    width: 200,
    height: 54,
    rel: "noreferrer",
  },
  {
    href: "https://dayslaunch.com",
    imgSrc: "https://dayslaunch.com/badages-awards.svg",
    alt: "Featured on Days Launch",
    height: 54,
  },
  {
    href: "https://frogdr.com/5svg.com?utm_source=5svg.com",
    imgSrc: "https://frogdr.com/5svg.com/badge-white.svg",
    alt: "Monitor your Domain Rating with FrogDR",
    width: 250,
    height: 54,
  },
  {
    href: "https://www.toolpilot.ai",
    imgSrc:
      "https://www.toolpilot.ai/cdn/shop/files/f-w_690x151_crop_center.png",
    alt: "Featured on Toolpilot",
    width: 120,
    height: 28,
    rel: "noreferrer",
  },
  {
    href: "https://dang.ai/",
    imgSrc:
      "https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png",
    alt: "Dang.ai",
    width: 150,
    height: 54,
  },
];
