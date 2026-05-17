import { getSvgBySlug, getIndexableIconSlugs } from "@/data";
import { getIconHref } from "@/utils/svg-slug";

export type BrowseIconEntry = {
  slug: string;
  title: string;
  href: string;
};

export type BrowseLetterGroup = {
  letter: string;
  icons: BrowseIconEntry[];
};

export function getBrowseIcons(): BrowseIconEntry[] {
  return getIndexableIconSlugs()
    .map((slug) => {
      const svg = getSvgBySlug(slug);
      if (!svg) return null;
      return {
        slug,
        title: svg.title,
        href: getIconHref(svg),
      };
    })
    .filter((entry): entry is BrowseIconEntry => entry !== null)
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
}

function getBrowseLetter(title: string): string {
  const first = title.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

export function groupBrowseIconsByLetter(icons: BrowseIconEntry[]): BrowseLetterGroup[] {
  const groups = new Map<string, BrowseIconEntry[]>();

  for (const icon of icons) {
    const letter = getBrowseLetter(icon.title);
    const list = groups.get(letter) ?? [];
    list.push(icon);
    groups.set(letter, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    })
    .map(([letter, entries]) => ({ letter, icons: entries }));
}
