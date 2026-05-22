import type { AppLocale } from "./config";
import { DEFAULT_LOCALE } from "./config";
import { merge } from "./merge";

export type Messages = Record<string, unknown>;

const loaders: Record<AppLocale, () => Promise<{ default: Messages }>> = {
  en: () => import("../../../messages/en.json"),
  zh: () => import("../../../messages/zh.json"),
  es: () => import("../../../messages/es.json"),
  de: () => import("../../../messages/de.json"),
  fr: () => import("../../../messages/fr.json"),
  jp: () => import("../../../messages/jp.json"),
  pt: () => import("../../../messages/pt.json"),
  ko: () => import("../../../messages/ko.json"),
  ru: () => import("../../../messages/ru.json"),
  ar: () => import("../../../messages/ar.json"),
};

export async function getMessagesForLocale(locale: AppLocale): Promise<Messages> {
  const localeMessages = (await loaders[locale]()).default;
  if (locale === DEFAULT_LOCALE) return localeMessages;
  const defaultMessages = (await loaders[DEFAULT_LOCALE]()).default;
  return merge(defaultMessages, localeMessages);
}
