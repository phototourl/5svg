import type { Messages } from "./messages";
import {
  aboutPage,
  licensePage,
  privacyPage,
  termsPage,
} from "@/config/trust-pages";

export type LegalSection = { h2: string; body: string };

export type LegalPageContent = {
  title: string;
  description: string;
  h1: string;
  sections: LegalSection[];
};

export type LegalPageKey = "about" | "license" | "privacy" | "terms";

const FALLBACK: Record<LegalPageKey, LegalPageContent> = {
  about: aboutPage,
  license: licensePage,
  privacy: privacyPage,
  terms: termsPage,
};

function asPage(value: unknown): LegalPageContent | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  if (
    typeof o.title !== "string" ||
    typeof o.description !== "string" ||
    typeof o.h1 !== "string" ||
    !Array.isArray(o.sections)
  ) {
    return null;
  }
  const sections: LegalSection[] = [];
  for (const item of o.sections) {
    if (!item || typeof item !== "object") continue;
    const s = item as Record<string, unknown>;
    if (typeof s.h2 === "string" && typeof s.body === "string") {
      sections.push({ h2: s.h2, body: s.body });
    }
  }
  if (!sections.length) return null;
  return {
    title: o.title,
    description: o.description,
    h1: o.h1,
    sections,
  };
}

/** Locale-aware legal page; falls back to English trust-pages config. */
export function getLegalPage(
  messages: Messages,
  key: LegalPageKey,
): LegalPageContent {
  const root = messages.LegalPages;
  if (root && typeof root === "object") {
    const page = asPage((root as Record<string, unknown>)[key]);
    if (page) return page;
  }
  return FALLBACK[key];
}
