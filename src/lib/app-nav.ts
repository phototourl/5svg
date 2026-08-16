import type { I18nContext } from "@/lib/i18n/context";
export type AppNavLink = {
  href: string;
  label: string;
};

/** Primary links still used by legacy mobile/sidebar helpers if referenced. */
export function getAppNavLinks(i18n: I18nContext): AppNavLink[] {
  return [
    { href: "/", label: i18n.t("common.nav.home") },
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    { href: "/shop", label: i18n.t("common.nav.svgBundles") },
    { href: "/contact", label: i18n.t("common.nav.contact") },
  ];
}

export function isAppNavActive(href: string, path: string): boolean {
  if (href === "/") return path === "/";
  if (href === "/library") {
    return (
      path === "/library" ||
      path.startsWith("/directory") ||
      path.startsWith("/icon/") ||
      path === "/browse" ||
      path.startsWith("/tags") ||
      path === "/favorites"
    );
  }
  if (href === "/shop") {
    return path === "/shop" || path.startsWith("/shop/");
  }
  return path === href || path.startsWith(`${href}/`);
}
