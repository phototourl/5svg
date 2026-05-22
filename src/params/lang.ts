import { isLocale } from "@/lib/i18n/config";

export function match(param: string): boolean {
  return isLocale(param);
}
