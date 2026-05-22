import { brand } from "@/brand";
import type { I18nContext } from "@/lib/i18n/context";

export type AppNavLink = {
  href: string;
  label: string;
};

/** Primary app header / sidebar navigation (same items, same order). */
export function getAppNavLinks(i18n: I18nContext): AppNavLink[] {
  return [
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    { href: "/browse", label: i18n.t("common.nav.browse") },
    { href: "/favorites", label: i18n.t("common.nav.favorites") },
    { href: "/more", label: i18n.t("common.nav.more") },
    ...(brand.showApiNav
      ? ([{ href: "/docs/api", label: i18n.t("common.nav.api") }] as const)
      : []),
    ...(brand.showDeveloperTools
      ? ([{ href: "/extensions", label: i18n.t("common.nav.extensions") }] as const)
      : []),
  ];
}

export function isAppNavActive(href: string, path: string): boolean {
  if (href === "/library") {
    return (
      path === "/library" ||
      path.startsWith("/directory") ||
      path.startsWith("/icon/")
    );
  }
  if (href === "/browse") {
    return path === "/browse" || path.startsWith("/tags");
  }
  if (href === "/more") {
    return path === "/more" || path.startsWith("/more/");
  }
  if (href === "/docs/api") {
    return path === "/docs/api" || path.startsWith("/docs/api/");
  }
  return path === href || path.startsWith(`${href}/`);
}
