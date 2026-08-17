import type { I18nContext } from "@/lib/i18n/context";
import { isShopEnabled } from "@/lib/shop";

export type AppNavLink = {
  href: string;
  label: string;
};

/** Primary links still used by legacy mobile/sidebar helpers if referenced. */
export function getAppNavLinks(i18n: I18nContext): AppNavLink[] {
  const links: AppNavLink[] = [
    { href: "/", label: i18n.t("common.nav.home") },
    { href: "/library", label: i18n.t("common.nav.freeSvg") },
    { href: "/contact", label: i18n.t("common.nav.contact") },
  ];
  if (isShopEnabled()) {
    links.splice(2, 0, {
      href: "/shop",
      label: i18n.t("common.nav.svgBundles"),
    });
  }
  return links;
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

