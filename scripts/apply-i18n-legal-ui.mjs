/**
 * Apply LegalPages + UI page strings to all locales.
 * Requires: scripts/data/legal-pages-locales.json, scripts/data/ui-pages-all.json
 * Run: node scripts/apply-i18n-legal-ui.mjs
 */
import fs from "fs";
import path from "path";

const dir = path.resolve("messages");

function deepMerge(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) return b;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      out[k] = k in a ? deepMerge(a[k], v) : v;
    }
    return out;
  }
  return b;
}

const legalRest = JSON.parse(
  fs.readFileSync("scripts/data/legal-pages-locales.json", "utf8"),
);
const uiByLocale = JSON.parse(
  fs.readFileSync("scripts/data/ui-pages-all.json", "utf8"),
);
const esLegal = JSON.parse(
  fs.readFileSync("scripts/data/legal-pages-es.json", "utf8"),
);

for (const [loc, legal] of Object.entries({ es: esLegal, ...legalRest })) {
  const file = path.join(dir, `${loc}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, {
    LegalPages: legal,
    ...(uiByLocale[loc] || {}),
  });
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("legal+ui", loc, "→", next.LegalPages.privacy.h1);
}

for (const loc of ["en", "zh"]) {
  const file = path.join(dir, `${loc}.json`);
  const cur = JSON.parse(fs.readFileSync(file, "utf8"));
  const next = deepMerge(cur, uiByLocale[loc]);
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
  console.log("ui", loc, "→", next.LibraryPage?.h1);
}

console.log("done");
