/**
 * Generate original geometric craft SVGs to expand packs toward ~22–24 files each.
 * Run: pnpm exec tsx utils/generate-craft-expansions.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "../static/shop/files/craft");

function svg(body: string, vb = "0 0 200 200"): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" data-source="5svg-original" fill="none">
${body}
</svg>
`;
}

function solid(d: string, fill = "#111"): string {
  return `  <path fill="${fill}" d="${d}"/>`;
}

/** Regular star path centered at cx,cy */
function starPath(cx: number, cy: number, rOuter: number, rInner: number, points = 5): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const ang = (Math.PI / points) * i - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    pts.push(`${cx + Math.cos(ang) * r},${cy + Math.sin(ang) * r}`);
  }
  return `M${pts.join("L")}Z`;
}

const files: Record<string, string> = {
  // —— Halloween ——
  "halloween-bat-silhouette": svg(
    solid(
      "M20 110c18-28 38-40 55-42 6 14 14 22 25 26-4-18-2-38 8-52 12 16 18 36 16 54 12-4 20-14 26-28 16 4 34 18 50 42-22 6-40 4-54-6-6 18-16 30-31 36-15-6-25-18-31-36-14 10-32 12-54 6z",
    ),
  ),
  "halloween-moon-crescent": svg(
    solid(
      "M130 20c-40 8-70 44-70 86s30 78 70 86c-52-4-92-46-92-96S78 24 130 20z",
    ),
  ),
  "halloween-pumpkin-simple": svg(`
  <ellipse cx="100" cy="115" rx="70" ry="55" fill="#111"/>
  <path fill="#111" d="M92 50c0-12 8-22 18-26 2 14-2 28-10 38z"/>
  <circle cx="78" cy="105" r="8" fill="#fff"/>
  <circle cx="122" cy="105" r="8" fill="#fff"/>
  <path fill="#fff" d="M70 135c10 14 50 14 60 0-12 8-48 8-60 0z"/>
`),
  "halloween-spider-web": svg(`
  <g stroke="#111" stroke-width="3" fill="none" stroke-linecap="round">
    <circle cx="100" cy="100" r="25"/>
    <circle cx="100" cy="100" r="50"/>
    <circle cx="100" cy="100" r="75"/>
    <path d="M100 20v160M20 100h160M40 40l120 120M160 40L40 160"/>
  </g>
`),
  "halloween-cat-silhouette": svg(
    solid(
      "M55 160c-10-30 2-70 25-90l-18-35 28 18 10-8 10 8 28-18-18 35c23 20 35 60 25 90H55zM78 105h8v8h-8zm36 0h8v8h-8z",
    ),
  ),
  "halloween-candy-corn": svg(
    solid("M100 30L55 170h90L100 30zm0 40l-18 70h36L100 70z", "#111"),
  ),
  "halloween-skull-simple": svg(`
  <ellipse cx="100" cy="95" rx="55" ry="60" fill="#111"/>
  <ellipse cx="78" cy="90" rx="12" ry="16" fill="#fff"/>
  <ellipse cx="122" cy="90" rx="12" ry="16" fill="#fff"/>
  <path fill="#fff" d="M90 125h20v18H90z"/>
  <path fill="#111" d="M70 155h12v20H70zm24 0h12v20H94zm24 0h12v20h-12z"/>
`),
  "halloween-witch-hat": svg(
    solid("M40 150h120l-20-20H60L40 150zm30-20l30-90 30 90H70z"),
  ),
  "halloween-tombstone": svg(
    solid("M55 170V80c0-25 20-45 45-45s45 20 45 45v90H55zm25-70h40v12H80zm0 24h40v12H80z"),
  ),
  "halloween-broom": svg(
    solid(
      "M30 160l110-110 12 12L42 172zM140 40c20 8 28 28 20 45l-25-12c6-12 2-26 5-33z",
    ),
  ),
  "halloween-cauldron": svg(
    solid(
      "M45 90h110c5 40 0 70-15 80H60c-15-10-20-40-15-80zm20-20c0-12 15-20 35-20s35 8 35 20H65z",
    ),
  ),
  "halloween-ghost-simple": svg(
    solid(
      "M100 30c-35 0-55 30-55 65v70l18-14 18 14 19-14 18 14 17-14 20 14V95c0-35-20-65-55-65zm-20 50a10 10 0 110 20 10 10 0 010-20zm40 0a10 10 0 110 20 10 10 0 010-20z",
    ),
  ),
  "halloween-spider": svg(
    solid(
      "M100 95a18 18 0 110 36 18 18 0 010-36zm-8-8a8 8 0 1116 0 8 8 0 01-16 0zM40 100c20-5 35 5 48 15M160 100c-20-5-35 5-48 15M35 120c22 0 40 5 52 18M165 120c-22 0-40 5-52 18M45 80c18 10 30 25 40 35M155 80c-18 10-30 25-40 35M50 145c18-5 32 0 42 12M150 145c-18-5-32 0-42 12",
    ),
  ),
  "halloween-keychain-ring": svg(`
  <circle cx="100" cy="45" r="18" stroke="#111" stroke-width="8" fill="none"/>
  <rect x="70" y="70" width="60" height="90" rx="10" fill="#111"/>
  <circle cx="100" cy="110" r="14" fill="#fff"/>
`),
  "halloween-star-burst": svg(solid(starPath(100, 100, 70, 30, 8))),
  "halloween-owl": svg(
    solid(
      "M100 40c-40 10-55 50-50 90 20 25 80 25 100 0 5-40-10-80-50-90zm-22 45a14 14 0 110 28 14 14 0 010-28zm44 0a14 14 0 110 28 14 14 0 010-28zM88 120h24l-12 18z",
    ),
  ),
  "halloween-raven": svg(
    solid(
      "M40 120c30-40 55-55 80-50 5-20 20-35 40-40-5 25 0 45 15 60-25 5-45 20-55 45H70c-5-20-15-35-30-15z",
    ),
  ),
  "halloween-candle": svg(`
  <rect x="80" y="70" width="40" height="100" rx="4" fill="#111"/>
  <path fill="#111" d="M100 30c12 18 8 30 0 40-8-10-12-22 0-40z"/>
  <rect x="96" y="62" width="8" height="12" fill="#111"/>
`),

  // —— Christmas ——
  "christmas-star-5": svg(solid(starPath(100, 100, 75, 32, 5))),
  "christmas-ornament": svg(`
  <rect x="88" y="28" width="24" height="18" rx="3" fill="#111"/>
  <circle cx="100" cy="115" r="55" fill="#111"/>
  <circle cx="100" cy="115" r="20" fill="#fff"/>
`),
  "christmas-bell": svg(
    solid(
      "M100 35c-30 5-45 35-42 70h84c3-35-12-65-42-70zm-8 20h16v10H92zM70 115h60l10 25H60l10-25zm22 35h16v15H92z",
    ),
  ),
  "christmas-candy-cane": svg(
    solid(
      "M120 40c20 0 35 15 35 35 0 12-6 22-15 28L85 168c-6 8-18 8-24 0-6-8 0-18 8-24l50-58c4-4 6-8 6-12 0-8-6-14-14-14s-14 6-14 14v8H75v-8c0-22 18-40 45-40z",
    ),
  ),
  "christmas-gift-box": svg(
    solid(
      "M40 85h120v85H40V85zm-8-25h136v25H32V60zm60-5c0-15 10-25 18-25s12 8 12 18c0-10 4-18 12-18s18 10 18 25H92zM95 60h10v110H95V60z",
    ),
  ),
  "christmas-holly": svg(
    solid(
      "M70 80c-20-5-30 15-18 30-15 10-10 30 8 28-5 18 15 28 28 15 10 15 32 8 30-10 18 5 28-12 18-25 15-8 8-28-8-28 2-18-18-25-30-12-12-12-30-5-28 2zm95 70a10 10 0 11-20 0 10 10 0 0120 0zm-18 18a8 8 0 11-16 0 8 8 0 0116 0zm18 10a8 8 0 11-16 0 8 8 0 0116 0z",
    ),
  ),
  "christmas-snowflake": svg(`
  <g stroke="#111" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M100 30v140M40 65l120 70M40 135l120-70"/>
    <path d="M100 55l12-18M100 55l-12-18M100 145l12 18M100 145l-12 18"/>
    <path d="M58 75l-20 2M58 75l-8-18M142 125l20-2M142 125l8 18"/>
    <path d="M58 125l-20-2M58 125l-8 18M142 75l20 2M142 75l8-18"/>
  </g>
`),
  "christmas-stocking": svg(
    solid(
      "M70 40h55v55c25 5 40 25 35 50-5 25-30 35-55 30V95H70V40zm0 0h55v18H70V40z",
    ),
  ),
  "christmas-wreath": svg(`
  <circle cx="100" cy="105" r="55" stroke="#111" stroke-width="22" fill="none"/>
  <path fill="#111" d="M88 35h24v20H88zM75 28c10 0 15 10 15 10s5-10 15-10c-5 18-25 18-30 0z"/>
`),
  "christmas-tree-simple": svg(
    solid("M100 25L55 85h25L45 130h30L35 175h130l-40-45h30L120 85h25L100 25z"),
  ),
  "christmas-reindeer-head": svg(
    solid(
      "M70 50c-15-25 5-35 20-20 5-20 25-20 30 0 15-15 35-5 20 20 15 15 20 40 10 60H60c-10-20-5-45 10-60zm15 55a8 8 0 110 16 8 8 0 010-16zm30 0a8 8 0 110 16 8 8 0 010-16zM90 130h20v15H90z",
    ),
  ),
  "christmas-mitten": svg(
    solid(
      "M75 50c0-20 15-35 35-35s30 12 30 30v70c0 20-15 35-35 35s-30-15-30-35V90c-15 5-25-5-25-18s12-25 25-22V50z",
    ),
  ),
  "christmas-gingerbread": svg(
    solid(
      "M100 35c15 0 25 12 25 28v10h20c10 0 15 10 10 18l-25 10v25l20 30c5 8-2 18-12 14l-28-18-28 18c-10 4-17-6-12-14l20-30V101L58 91c-5-8 0-18 10-18h20V63c0-16 10-28 25-28z",
    ),
  ),

  // —— Fall ——
  "fall-maple-leaf": svg(
    solid(
      "M100 25c5 20 0 35-10 45 25-5 40-25 55-20-10 20-30 25-40 25 20 15 35 40 30 55-20-5-35-20-40-30 0 25 5 50 5 70H95c0-20 5-45 5-70-5 10-20 25-40 30-5-15 10-40 30-55-10 0-30-5-40-25 15-5 30 15 55 20-10-10-15-25-10-45z",
    ),
  ),
  "fall-oak-leaf": svg(
    solid(
      "M105 30c40 20 55 55 45 90-15 10-30 5-40-5 5 25 0 50-5 65H90c-5-15-10-40-5-65-10 10-25 15-40 5C35 85 50 50 90 30c0 15 5 25 15 30 10-5 15-15 15-30z",
    ),
  ),
  "fall-acorn": svg(`
  <path fill="#111" d="M70 85c0-25 15-40 30-40s30 15 30 40H70z"/>
  <ellipse cx="100" cy="130" rx="32" ry="40" fill="#111"/>
  <rect x="95" y="40" width="10" height="20" fill="#111"/>
`),
  "fall-pumpkin-outline": svg(`
  <ellipse cx="100" cy="115" rx="68" ry="52" fill="none" stroke="#111" stroke-width="8"/>
  <path fill="#111" d="M95 55c0-12 8-22 18-24 0 14-4 28-12 38z"/>
  <path fill="none" stroke="#111" stroke-width="5" d="M70 90c10 40 50 40 60 0"/>
`),
  "fall-wheat": svg(
    solid(
      "M100 30c8 15 8 30 0 45 8 5 18 5 25-5-5 20-18 30-25 35 10 8 15 25 10 40-12-10-18-25-15-40-10 8-25 5-35-8 12 0 25-10 30-22-12 0-28-8-35-22 18 5 30 5 35 5-5-12-5-25 10-28zM96 95h8v75h-8z",
    ),
  ),
  "fall-mushroom": svg(
    solid(
      "M40 95c0-40 30-65 60-65s60 25 60 65H40zm45 0h30v65c0 10-8 18-15 18s-15-8-15-18V95z",
    ),
  ),
  "fall-fox-face": svg(
    solid(
      "M40 70L100 30l60 40v50c0 30-25 50-60 50S40 150 40 120V70zm35 40a10 10 0 110 20 10 10 0 010-20zm50 0a10 10 0 110 20 10 10 0 010-20zM90 130h20l-10 15z",
    ),
  ),
  "fall-sunflower": svg(`
  <circle cx="100" cy="100" r="28" fill="#111"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315]
    .map((a) => {
      const r = (a * Math.PI) / 180;
      const x = 100 + Math.cos(r) * 55;
      const y = 100 + Math.sin(r) * 55;
      return `<ellipse cx="${x}" cy="${y}" rx="16" ry="28" transform="rotate(${a} ${x} ${y})" fill="#111"/>`;
    })
    .join("\n  ")}
`),
  "fall-leaf-pair": svg(
    solid(
      "M55 60c30 10 45 40 35 70-25-5-45-30-40-55 5-10 5-15 5-15zm90 10c-30 10-45 40-35 70 25-5 45-30 40-55-5-10-5-15-5-15zM96 120h8v50h-8z",
    ),
  ),
  "fall-harvest-basket": svg(
    solid(
      "M50 90h100l-10 70H60L50 90zm10-25c15-20 65-20 80 0l-10 15H70L60 65z",
    ),
  ),
  "fall-scarecrow-hat": svg(
    solid("M35 120h130l-15-20H50L35 120zm25-20l40-55 40 55H60z"),
  ),
  "fall-pinecone": svg(
    solid(
      "M100 30c25 15 35 40 30 70-5 30-20 55-30 70-10-15-25-40-30-70-5-30 5-55 30-70zm-20 50h40v8H80zm-5 20h50v8H75zm0 20h50v8H75zm5 20h40v8H80z",
    ),
  ),
  "fall-crow": svg(
    solid(
      "M45 115c25-35 50-50 75-45 8-18 25-30 45-32-8 22-2 42 12 55-22 8-40 22-50 45H70c-8-18-15-30-25-23z",
    ),
  ),
  "fall-apple": svg(
    solid(
      "M100 55c-5-20 10-30 22-28-2 12-8 22-18 28 25-5 48 20 48 50 0 35-25 65-52 65S48 140 48 105c0-30 22-55 48-50 5-8 12-18 18-28-15 0-25 12-14 28z",
    ),
  ),

  // —— Patriotic ——
  "patriotic-star-single": svg(solid(starPath(100, 100, 70, 28, 5))),
  "patriotic-star-row": svg(
    [40, 100, 160]
      .map((x) => solid(starPath(x, 100, 28, 12, 5)))
      .join("\n"),
  ),
  "patriotic-banner": svg(
    solid("M20 60h160l-15 40 15 40H20l15-40L20 60zm30 25h100v30H50V85z"),
  ),
  "patriotic-shield": svg(
    solid("M100 25l60 25v45c0 40-30 70-60 80-30-10-60-40-60-80V50l60-25z"),
  ),
  "patriotic-eagle-simple": svg(
    solid(
      "M100 55c-10 0-20 10-20 25v15H50c-15 20-20 45-10 55 25-10 40-5 60-5s35-5 60 5c10-10 5-35-10-55h-30V80c0-15-10-25-20-25zm0 70c-8 20-25 35-40 40 20 5 60 5 80 0-15-5-32-20-40-40z",
    ),
  ),
  "patriotic-stripes-block": svg(`
  ${[40, 70, 100, 130, 160]
    .map((y) => `<rect x="30" y="${y}" width="140" height="18" fill="#111"/>`)
    .join("\n  ")}
`),
  "patriotic-circle-stars": svg(`
  <circle cx="100" cy="100" r="75" fill="none" stroke="#111" stroke-width="8"/>
  ${[0, 72, 144, 216, 288]
    .map((a) => {
      const r = ((a - 90) * Math.PI) / 180;
      return solid(starPath(100 + Math.cos(r) * 42, 100 + Math.sin(r) * 42, 14, 6, 5));
    })
    .join("\n  ")}
`),
  "patriotic-heart-star": svg(`
  ${solid("M100 170S40 120 40 80c0-25 20-40 40-40 12 0 20 8 20 8s8-8 20-8c20 0 40 15 40 40 0 40-60 90-60 90z")}
  ${solid(starPath(100, 95, 22, 9, 5), "#fff")}
`),
  "patriotic-laurel": svg(
    solid(
      "M100 40c-35 25-50 60-45 100 20-15 35-40 45-70 10 30 25 55 45 70 5-40-10-75-45-100zM85 150h30v20H85z",
    ),
  ),
  "patriotic-burst": svg(solid(starPath(100, 100, 80, 20, 12))),
  "patriotic-badge": svg(`
  <circle cx="100" cy="100" r="55" fill="#111"/>
  <circle cx="100" cy="100" r="40" fill="#fff"/>
  ${solid(starPath(100, 100, 28, 12, 5))}
`),
  "patriotic-ribbon": svg(
    solid("M60 40h80v90l-20-12-20 20-20-20-20 12V40zm10 15h60v20H70V55z"),
  ),
  "patriotic-anchor": svg(
    solid(
      "M100 30a18 18 0 110 36 18 18 0 010-36zm-6 40h12v50c25-5 45-25 50-50h12c-5 35-30 65-62 72v28H88v-28C56 135 31 105 26 70h12c5 25 25 45 50 50V70z",
    ),
  ),
  "patriotic-flame": svg(
    solid("M100 30c30 35 45 60 45 90 0 30-20 50-45 50S55 150 55 120c0-30 20-55 45-90 5 25 0 45-10 60 20-5 30-25 25-50z"),
  ),

  // —— Family / labels ——
  "family-heart-frame": svg(`
  <path fill="none" stroke="#111" stroke-width="8" d="M100 170S35 115 35 75c0-28 22-45 45-45 14 0 20 10 20 10s6-10 20-10c23 0 45 17 45 45 0 40-65 95-65 95z"/>
`),
  "family-circle-monogram": svg(`
  <circle cx="100" cy="100" r="70" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="100" cy="100" r="50" fill="none" stroke="#111" stroke-width="4"/>
`),
  "family-banner-name": svg(
    solid("M25 70h150l-12 30 12 30H25l12-30L25 70zm20 18h110v24H45V88z"),
  ),
  "family-house": svg(
    solid("M100 35L30 95h25v70h40v-40h20v40h40V95h25L100 35z"),
  ),
  "family-baby-feet": svg(
    solid(
      "M55 80c15-25 45-20 50 5 5 25-15 50-35 45-20-5-25-30-15-50zm8-28a8 8 0 110 0zm18-8a8 8 0 110 0zm20 4a8 8 0 110 0zm14 14a8 8 0 110 0zM130 95c15-25 45-15 45 12 0 25-22 42-40 35-20-8-18-28-5-47zm5-25a7 7 0 110 0zm15-6a7 7 0 110 0zm16 6a7 7 0 110 0zm10 14a7 7 0 110 0z",
    ),
  ),
  "family-ring": svg(`
  <circle cx="80" cy="100" r="32" fill="none" stroke="#111" stroke-width="10"/>
  <circle cx="120" cy="100" r="32" fill="none" stroke="#111" stroke-width="10"/>
`),
  "family-arrow-split": svg(
    solid("M30 100h100l-20-25 45 25-45 25 20-25H30zm100-40v80l40-40-40-40z"),
  ),
  "family-school-apple": svg(
    solid(
      "M100 55c20-5 45 15 45 45 0 40-25 70-45 70S55 140 55 100c0-30 25-50 45-45 0-15 10-28 25-30-8 12-15 25-25 30z",
    ),
  ),
  "family-star-name": svg(`
  ${solid(starPath(100, 70, 35, 14, 5))}
  <rect x="40" y="120" width="120" height="36" rx="6" fill="#111"/>
`),
  "family-bookmark": svg(
    solid("M60 30h80v150l-40-28-40 28V30z"),
  ),
  "family-tag": svg(
    solid("M30 80l70-50h60v100H100L30 120V80zm95-15a12 12 0 110 24 12 12 0 010-24z"),
  ),
  "family-camera": svg(
    solid(
      "M55 70h20l10-15h30l10 15h20c10 0 15 8 15 18v55c0 10-5 18-15 18H55c-10 0-15-8-15-18V88c0-10 5-18 15-18zm45 25a22 22 0 100 44 22 22 0 000-44z",
    ),
  ),
  "family-key": svg(
    solid(
      "M70 70a30 30 0 1155 22l-12 12 10 10-12 12-10-10-8 8H70V70zm20 8a12 12 0 100 24 12 12 0 000-24z",
    ),
  ),
  "family-paw": svg(
    solid(
      "M100 120c25 0 45 20 40 40H60c-5-20 15-40 40-40zm-35-35a16 16 0 110 0zm70 0a16 16 0 110 0zm-50-30a14 14 0 110 0zm30 0a14 14 0 110 0z",
    ),
  ),
  "family-graduation": svg(
    solid("M100 40L30 75l70 35 70-35-70-35zm-50 50v35l50 25 50-25v-35l-50 25L50 90z"),
  ),

  // —— Wellness / love ——
  "wellness-heart": svg(
    solid(
      "M100 175S30 120 30 75c0-30 25-50 50-50 15 0 20 12 20 12s5-12 20-12c25 0 50 20 50 50 0 45-70 100-70 100z",
    ),
  ),
  "wellness-heart-outline": svg(`
  <path fill="none" stroke="#111" stroke-width="8" d="M100 170S35 115 35 75c0-28 22-45 45-45 14 0 20 10 20 10s6-10 20-10c23 0 45 17 45 45 0 40-65 95-65 95z"/>
`),
  "wellness-lotus": svg(
    solid(
      "M100 160c-30-20-50-50-50-85 20 15 40 25 50 25s30-10 50-25c0 35-20 65-50 85zm0-40c-15-25-10-55 0-75 10 20 15 50 0 75z",
    ),
  ),
  "wellness-yoga": svg(
    solid(
      "M100 35a16 16 0 110 32 16 16 0 010-32zM70 85h60l-10 35H80L70 85zm5 40h50l15 50H60l15-50z",
    ),
  ),
  "wellness-leaf-mind": svg(
    solid(
      "M100 30c45 25 60 70 45 110-30-10-50-40-55-75-5 35-25 65-55 75-15-40 0-85 45-110 5 20 15 35 20 45 5-10 15-25 20-45z",
    ),
  ),
  "wellness-sun-rays": svg(`
  <circle cx="100" cy="100" r="30" fill="#111"/>
  <g stroke="#111" stroke-width="8" stroke-linecap="round">
    <path d="M100 25v20M100 155v20M25 100h20M155 100h20M42 42l14 14M144 144l14 14M42 158l14-14M144 56l14-14"/>
  </g>
`),
  "wellness-moon-calm": svg(
    solid("M125 40c-40 10-70 45-70 85s30 75 70 85c-50-8-90-48-90-100S75 48 125 40z"),
  ),
  "wellness-hands-care": svg(
    solid(
      "M55 110c0-25 20-40 40-35v60c-25 0-40-10-40-25zm90 0c0-25-20-40-40-35v60c25 0 40-10 40-25zM80 70c10-25 30-25 40 0-15 5-25 5-40 0z",
    ),
  ),
  "wellness-infinity": svg(
    solid(
      "M60 100c0-20 15-35 35-35 12 0 22 6 30 15 8-9 18-15 30-15 20 0 35 15 35 35s-15 35-35 35c-12 0-22-6-30-15-8 9-18 15-30 15-20 0-35-15-35-35zm35 0c0 8 6 15 15 15s15-7 15-15-6-15-15-15-15 7-15 15zm50 0c0 8 6 15 15 15s15-7 15-15-6-15-15-15-15 7-15 15z",
    ),
  ),
  "wellness-smile": svg(`
  <circle cx="100" cy="100" r="70" fill="none" stroke="#111" stroke-width="8"/>
  <circle cx="75" cy="85" r="8" fill="#111"/>
  <circle cx="125" cy="85" r="8" fill="#111"/>
  <path fill="none" stroke="#111" stroke-width="8" stroke-linecap="round" d="M65 120c10 20 60 20 70 0"/>
`),
  "wellness-dove": svg(
    solid(
      "M40 110c30-30 55-40 85-35 5-20 25-40 50-45-15 25-10 50 5 70-30 0-55 15-70 40H70c-5-20-15-35-30-30z",
    ),
  ),
  "wellness-wave": svg(`
  <path fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" d="M25 100c20-30 40-30 60 0s40 30 60 0 40-30 55 0"/>
  <path fill="none" stroke="#111" stroke-width="10" stroke-linecap="round" d="M25 130c20-30 40-30 60 0s40 30 60 0 40-30 55 0"/>
`),
  "wellness-mountain": svg(
    solid("M20 160L75 70l25 35 25-50 55 105H20zm55-40l15 20h-30l15-20z"),
  ),
  "wellness-balance": svg(
    solid(
      "M95 40h10v120H95V40zm-50 50h110v10H45V90zm0 10l-20 45h40L45 100zm110 0l-20 45h40l-20-45zM85 30h30v12H85V30z",
    ),
  ),
  "wellness-spark": svg(solid(starPath(100, 100, 55, 18, 4))),

  // —— Shapes ——
  "shape-circle": svg(`<circle cx="100" cy="100" r="70" fill="#111"/>`),
  "shape-square": svg(`<rect x="35" y="35" width="130" height="130" rx="8" fill="#111"/>`),
  "shape-triangle": svg(solid("M100 30L170 170H30L100 30z")),
  "shape-hexagon": svg(
    solid("M100 25l60 35v70l-60 35-60-35V60L100 25z"),
  ),
  "shape-diamond": svg(solid("M100 25l70 75-70 75-70-75 70-75z")),
  "shape-oval": svg(`<ellipse cx="100" cy="100" rx="55" ry="75" fill="#111"/>`),
  "shape-arch": svg(
    solid("M40 170V100a60 60 0 01120 0v70h-25v-70a35 35 0 00-70 0v70H40z"),
  ),
  "shape-cross": svg(solid("M80 30h40v50h50v40h-50v50H80v-50H30V80h50V30z")),
  "shape-plus-rounded": svg(
    solid("M80 40h40v40h40v40h-40v40H80v-40H40V80h40V40z"),
  ),
  "shape-arrow-up": svg(solid("M100 25l60 70H120v80H80v-80H40l60-70z")),
  "shape-cloud": svg(
    solid(
      "M65 140c-25 0-40-20-35-40 5-20 25-30 45-25 5-25 30-40 55-30 20 8 30 30 25 50 20 0 35 15 30 35-5 15-20 25-40 25H65z",
    ),
  ),
  "shape-teardrop": svg(solid("M100 25c40 45 55 80 55 105a55 55 0 11-110 0c0-25 15-60 55-105z")),
  "shape-burst-8": svg(solid(starPath(100, 100, 75, 35, 8))),
  "shape-frame-rect": svg(`
  <rect x="30" y="40" width="140" height="120" rx="6" fill="none" stroke="#111" stroke-width="12"/>
`),
  "shape-scallop": svg(
    solid(
      "M40 70c10-20 30-25 40-10 10-20 30-20 40 0 10-15 30-10 40 10v80H40V70z",
    ),
  ),
};

async function main() {
  await mkdir(OUT, { recursive: true });
  let n = 0;
  for (const [name, content] of Object.entries(files)) {
    await writeFile(path.join(OUT, `${name}.svg`), content, "utf8");
    n++;
  }
  console.log(`Wrote ${n} original craft SVGs → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
