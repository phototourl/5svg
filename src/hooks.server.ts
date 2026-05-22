import type { Handle } from "@sveltejs/kit";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALES,
  isLocale,
  type AppLocale,
} from "@/lib/i18n/config";
import { stripLocalePrefix } from "@/lib/i18n/paths";

export const handle: Handle = async ({ event, resolve }) => {
  const segments = event.url.pathname.split("/").filter(Boolean);
  const first = segments[0];
  let locale: AppLocale = DEFAULT_LOCALE;

  if (isLocale(first)) {
    locale = first;
  } else {
    const cookieLocale = event.cookies.get(LOCALE_COOKIE);
    if (isLocale(cookieLocale)) {
      locale = cookieLocale;
    }
  }

  event.locals.locale = locale;
  event.locals.pathnameWithoutLocale = stripLocalePrefix(
    event.url.pathname,
    LOCALES,
  );

  const response = await resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace("%lang%", locale).replace("%dir%", locale === "ar" ? "rtl" : "ltr"),
  });

  return response;
};
