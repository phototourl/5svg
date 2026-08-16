import { browseSeo } from "@/config/browse-seo";
import { librarySeo } from "@/config/library-seo";
import { LOCALES } from "@/lib/i18n/config";
import { stripLocalePrefix } from "@/lib/i18n/paths";
import type { Translator } from "@/lib/i18n/translator";
import { tagPageBySlug, isTagSlug } from "@/config/tag-pages";
import { getDirectorySeo } from "@/config/directory-seo";
import { getSvgBySlug } from "@/data";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function getAppBreadcrumbs(
  pathname: string,
  pageData?: Record<string, unknown>,
  t?: Translator,
): BreadcrumbItem[] {
  const path = stripLocalePrefix(pathname, LOCALES);
  const home: BreadcrumbItem = {
    label: t?.("common.nav.home") ?? "Home",
    href: "/",
  };

  if (path === "/library") {
    return [home, { label: t?.("LibraryPage.h1") ?? librarySeo.h1 }];
  }

  if (path === "/shop" || path.startsWith("/shop/")) {
    const crumbs: BreadcrumbItem[] = [
      home,
      { label: t?.("common.nav.svgBundles") ?? "Bundles", href: "/shop" },
    ];
    if (path === "/shop/download") {
      crumbs.push({ label: t?.("shop.downloadTitle") ?? "Download" });
    } else if (path !== "/shop") {
      const slug = path.replace(/^\/shop\//, "");
      crumbs.push({ label: slug });
    }
    return crumbs;
  }

  if (path === "/browse") {
    return [home, { label: t?.("BrowsePage.h1") ?? browseSeo.h1 }];
  }

  const directoryMatch = path.match(/^\/directory\/([^/]+)\/?$/);
  if (directoryMatch) {
    const slug = decodeURIComponent(directoryMatch[1]);
    const formatted = slug.charAt(0).toUpperCase() + slug.slice(1);
    return [
      home,
      { label: t?.("common.nav.freeSvg") ?? "Library", href: "/library" },
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
      const categories = Array.isArray(svg.category)
        ? svg.category
        : [svg.category];
      const crumbs: BreadcrumbItem[] = [
        home,
        { label: t?.("common.nav.freeSvg") ?? "Library", href: "/library" },
      ];
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

  if (path.startsWith("/docs/")) {
    const doc = pageData?.document as { title?: string } | undefined;
    return [
      home,
      { label: "Docs", href: "/docs/shadcn-ui" },
      ...(doc?.title ? [{ label: doc.title }] : []),
    ];
  }

  if (["/about", "/license", "/privacy", "/terms"].includes(path)) {
    const label =
      path === "/about"
        ? (t?.("common.footer.about") ?? "About")
        : path === "/license"
          ? (t?.("common.footer.licensingPolicy") ?? "Licensing Policy")
          : path === "/terms"
            ? (t?.("common.footer.termsOfService") ?? "Terms of Service")
            : (t?.("common.footer.privacyPolicy") ?? "Privacy Policy");
    return [home, { label }];
  }

  return [];
}
