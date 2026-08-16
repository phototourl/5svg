import type { AppLocale } from "./config";
import { DEFAULT_LOCALE, localeMessageParent } from "./config";
import { merge } from "./merge";

import uiPagesAll from "../../../scripts/data/ui-pages-all.json";
import legalLocales from "../../../scripts/data/legal-pages-locales.json";
import legalEs from "../../../scripts/data/legal-pages-es.json";

export type Messages = Record<string, unknown>;

/** Auto-load every `messages/{locale}.json` (including hyphenated codes). */
const eagerPacks = import.meta.glob("../../../messages/*.json", {
  eager: true,
}) as Record<string, { default: Messages }>;

function packPath(locale: string): string {
  return `../../../messages/${locale}.json`;
}

function readPackFile(locale: AppLocale): Messages | undefined {
  return eagerPacks[packPath(locale)]?.default;
}

const legalOverlay: Partial<Record<string, Messages>> = {
  es: legalEs as Messages,
  ...(legalLocales as Record<string, Messages>),
};

function localeExtras(locale: AppLocale): Messages {
  const uiTable = uiPagesAll as Record<string, Messages>;
  const uiKey =
    uiTable[locale] != null
      ? locale
      : (localeMessageParent[locale] ?? locale);
  const ui = (uiTable[uiKey] ?? {}) as Messages;

  const legal =
    legalOverlay[locale] ??
    (localeMessageParent[locale]
      ? legalOverlay[localeMessageParent[locale]!]
      : undefined);

  if (legal) {
    return { ...ui, LegalPages: legal };
  }
  return { ...ui };
}

async function loadRawMessages(locale: AppLocale): Promise<Messages> {
  const own = readPackFile(locale);
  if (own) return own;

  const parent = localeMessageParent[locale];
  if (parent) {
    const parentPack = readPackFile(parent);
    if (parentPack) return parentPack;
  }
  return {};
}

export async function getMessagesForLocale(
  locale: AppLocale,
): Promise<Messages> {
  const localeMessages = await loadRawMessages(locale);
  const extras = localeExtras(locale);

  if (locale === DEFAULT_LOCALE) {
    return merge(localeMessages, extras);
  }

  const defaultMessages = await loadRawMessages(DEFAULT_LOCALE);
  return merge(merge(defaultMessages, localeMessages), extras);
}
