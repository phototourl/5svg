import type { LayoutServerLoad } from "./$types";
import { resolveLocale } from "@/lib/i18n/config";
import { getMessagesForLocale } from "@/lib/i18n/messages";

export const load: LayoutServerLoad = async ({ params }) => {
  const locale = resolveLocale(params.lang);
  const messages = await getMessagesForLocale(locale);

  return {
    locale,
    messages,
  };
};
