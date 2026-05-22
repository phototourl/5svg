import { browseSeo } from "@/config/browse-seo";
import { librarySeo } from "@/config/library-seo";
import { LOCALES } from "@/lib/i18n/config";
import { stripLocalePrefix } from "@/lib/i18n/paths";
import { tagPageBySlug, isTagSlug } from "@/config/tag-pages";
import { iconPackById, isIconPackId } from "@/config/icon-packs";
import { getDirectorySeo } from "@/config/directory-seo";
import { getSvgBySlug } from "@/data";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function getAppBreadcrumbs(
  pathname: string,
  pageData?: Record<string, unknown>,
): BreadcrumbItem[] {
  const path = stripLocalePrefix(pathname, LOCALES);
  const home: BreadcrumbItem = { label: "Home", href: "/" };

  if (path === "/library") {
    return [home, { label: librarySeo.h1 }];
  }

  if (path === "/browse") {
    return [home, { label: browseSeo.h1 }];
  }

  if (path === "/more") {
    return [home, { label: "More icon packs" }];
  }

  const directoryMatch = path.match(/^\/directory\/([^/]+)\/?$/);
  if (directoryMatch) {
    const slug = decodeURIComponent(directoryMatch[1]);
    const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
    return [
      home,
      { label: "Library", href: "/library" },
      { label: getDirectorySeo(formatted, 0).headerH1 },
    ];
  }

  const tagMatch = path.match(/^\/tags\/([^/]+)\/?$/);
  if (tagMatch && isTagSlug(tagMatch[1])) {
    const tag = tagPageBySlug[tagMatch[1]];
    return [
      home,
      { label: "Topics", href: "/tags" },
      { label: tag.h1 },
    ];
  }

  if (path === "/tags") {
    return [home, { label: "Topics" }];
  }

  const iconMatch = path.match(/^\/icon\/([^/]+)\/?$/);
  if (iconMatch) {
    const svg = getSvgBySlug(iconMatch[1]);
    if (svg) {
      const categories = Array.isArray(svg.category) ? svg.category : [svg.category];
      const crumbs: BreadcrumbItem[] = [home, { label: "Library", href: "/library" }];
      if (categories[0]) {
        crumbs.push({
          label: categories[0],
          href: `/directory/${categories[0].toLowerCase()}`,
        });
      }
      crumbs.push({ label: svg.title });
      return crumbs;
    }
  }

  if (pageData?.pack && pageData?.icon) {
    const pack = pageData.pack as { id: string; name: string };
    const icon = pageData.icon as { title: string };
    return [
      home,
      { label: "More", href: "/more" },
      { label: pack.name, href: `/more/${pack.id}` },
      { label: icon.title },
    ];
  }

  const packMatch = path.match(/^\/more\/([^/]+)\/?$/);
  if (packMatch && isIconPackId(packMatch[1])) {
    const pack = iconPackById[packMatch[1]];
    return [home, { label: "More", href: "/more" }, { label: pack.name }];
  }

  if (path.startsWith("/docs/")) {
    const doc = pageData?.document as { title?: string } | undefined;
    return [
      home,
      { label: "Docs", href: "/docs/api" },
      ...(doc?.title ? [{ label: doc.title }] : []),
    ];
  }

  if (["/about", "/license", "/privacy"].includes(path)) {
    const label =
      path === "/about" ? "About" : path === "/license" ? "License" : "Privacy";
    return [home, { label }];
  }

  return [];
}
