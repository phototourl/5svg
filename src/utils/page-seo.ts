import { brand } from "@/brand";
import { siteDocTitleSuffix, siteSeo } from "@/config/seo";
import { librarySeo } from "@/config/library-seo";
import { favoritesSeo } from "@/config/favorites-seo";
import { getDirectorySeo } from "@/config/directory-seo";
import { iconPackById, isIconPackId } from "@/config/icon-packs";
import { getSvgBySlug, getSvgsByCategory } from "@/data";
import { allDocs } from "content-collections";
import { aboutPage, licensePage, privacyPage } from "@/config/trust-pages";
import { browseSeo } from "@/config/browse-seo";
import { getIconDetailSeo, getIconSocialPreview } from "@/config/icon-detail-seo";
import { isTagSlug, tagPageBySlug } from "@/config/tag-pages";
import type { iSVG } from "@/types/svg";

export type ResolvedPageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  twitterCard?: "summary" | "summary_large_image";
};

function resolveIconPageSeo(svg: iSVG, canonical: string): ResolvedPageSeo {
  const seo = getIconDetailSeo(svg);
  const social = getIconSocialPreview(svg);
  return {
    title: seo.title,
    description: seo.description,
    canonical,
    robots: "index, follow",
    ogImage: social.ogImage,
    ogImageAlt: social.ogImageAlt,
    ogImageWidth: social.ogImageWidth,
    ogImageHeight: social.ogImageHeight,
    twitterCard: social.twitterCard,
  };
}

const NOINDEX_PATHS = new Set(["/favorites"]);

/** Canonical URL without query strings or hash. */
export function toCanonicalUrl(pathname: string): string {
  const base = brand.siteUrl.replace(/\/+$/, "");
  if (pathname === "/") return `${base}/`;
  const path = pathname.replace(/\/+$/, "") || "/";
  return `${base}${path}`;
}

function formatCategorySlug(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function resolvePageSeo(
  pathname: string,
  pageData?: Record<string, unknown>,
): ResolvedPageSeo {
  const canonical = toCanonicalUrl(pathname);

  if (NOINDEX_PATHS.has(pathname)) {
    return {
      title: favoritesSeo.title,
      description: favoritesSeo.description,
      canonical,
      robots: "noindex, follow",
    };
  }

  if (pathname.startsWith("/docs/") && pageData?.document) {
    const doc = pageData.document as {
      metaTitle?: string;
      title: string;
      description: string;
    };
    return {
      title: doc.metaTitle ?? `${doc.title} | ${siteDocTitleSuffix}`,
      description: doc.description,
      canonical,
      robots: "index, follow",
    };
  }

  if (pathname.startsWith("/icon/") && pageData?.svg) {
    return resolveIconPageSeo(pageData.svg as iSVG, canonical);
  }

  if (pageData?.pack && pageData?.icon && pageData?.seo) {
    const seo = pageData.seo as { title: string; description: string };
    return {
      title: seo.title,
      description: seo.description,
      canonical,
      robots: "index, follow",
    };
  }

  const tagMatch = pathname.match(/^\/tags\/([^/]+)\/?$/);
  if (tagMatch && isTagSlug(tagMatch[1])) {
    const tag = tagPageBySlug[tagMatch[1]];
    return {
      title: tag.title,
      description: tag.description,
      canonical,
      robots: "index, follow",
    };
  }

  if (pathname === "/tags") {
    return {
      title: "SVG Topics & Collections — Free Logo Guides | 5SVG",
      description:
        "Browse topic pages for social media icons, AI logos, Cricut SVGs, design tools, and more free vector collections.",
      canonical,
      robots: "index, follow",
    };
  }

  const packListMatch = pathname.match(/^\/more\/([^/]+)\/?$/);
  if (packListMatch && isIconPackId(packListMatch[1]) && pageData?.pack) {
    const pack = pageData.pack as {
      name: string;
      license: string;
      description: string;
    };
    return {
      title: `${pack.name} — Free SVG Icon Pack | 5SVG`,
      description: `Browse ${pack.name} SVG icons. ${pack.description} License: ${pack.license}.`,
      canonical,
      robots: "index, follow",
    };
  }

  const directoryMatch = pathname.match(/^\/directory\/([^/]+)\/?$/);
  if (directoryMatch) {
    const slug = decodeURIComponent(directoryMatch[1]);
    const formatted = formatCategorySlug(slug);
    const count = getSvgsByCategory(slug).length;
    const seo = getDirectorySeo(formatted, count);
    return {
      title: seo.title,
      description: seo.description,
      canonical,
      robots: "index, follow",
    };
  }

  const staticPages: Record<string, { title: string; description: string }> = {
    "/": { title: siteSeo.title, description: siteSeo.description },
    "/library": { title: librarySeo.title, description: librarySeo.description },
    "/browse": { title: browseSeo.title, description: browseSeo.description },
    "/more": {
      title: "More Icon Packs — Free SVG Collections | 5SVG",
      description:
        "Browse Bootstrap Icons, Font Awesome 7, and React Icons packs separately from the main brand SVG library.",
    },
    "/about": { title: aboutPage.title, description: aboutPage.description },
    "/license": { title: licensePage.title, description: licensePage.description },
    "/privacy": { title: privacyPage.title, description: privacyPage.description },
  };

  const staticSeo = staticPages[pathname];
  if (staticSeo) {
    return { ...staticSeo, canonical, robots: "index, follow" };
  }

  const packMatch = pathname.match(/^\/more\/([^/]+)\/?$/);
  if (packMatch && isIconPackId(packMatch[1])) {
    const pack = iconPackById[packMatch[1]];
    return {
      title: `${pack.name} — Free SVG Icon Pack | 5SVG`,
      description: `Browse ${pack.name} SVG icons. ${pack.description} License: ${pack.license}.`,
      canonical,
      robots: "index, follow",
    };
  }

  const iconMatch = pathname.match(/^\/icon\/([^/]+)\/?$/);
  if (iconMatch) {
    const svg = getSvgBySlug(iconMatch[1]);
    if (svg) {
      return resolveIconPageSeo(svg, canonical);
    }
  }

  const docsMatch = pathname.match(/^\/docs\/(.+)$/);
  if (docsMatch) {
    const doc = allDocs.find((entry) => entry._meta.path === docsMatch[1]);
    if (doc) {
      return {
        title: doc.metaTitle ?? `${doc.title} | ${siteDocTitleSuffix}`,
        description: doc.description,
        canonical,
        robots: "index, follow",
      };
    }
  }

  return {
    title: siteSeo.title,
    description: siteSeo.description,
    canonical,
    robots: "index, follow",
  };
}
