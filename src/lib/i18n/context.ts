import { page } from "$app/state";
import { DEFAULT_LOCALE, type AppLocale } from "./config";
import { localizePath } from "./paths";
import type { Messages } from "./messages";
import { createTranslator, type Translator } from "./translator";

export type I18nContext = {
  locale: AppLocale;
  t: Translator;
  localizePath: (path: string) => string;
};

/** Read locale + messages from the current [[lang]] layout load (reactive via `page`). */
export function getI18n(): I18nContext {
  const locale = (page.data.locale as AppLocale | undefined) ?? DEFAULT_LOCALE;
  const messages = (page.data.messages as Messages | undefined) ?? {};
  return {
    locale,
    t: createTranslator(messages),
    localizePath: (path: string) => localizePath(path, locale),
  };
}
