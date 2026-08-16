import type { Translator } from "./translator";

export type HomeFaqItem = { question: string; answer: string };

const FAQ_KEYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/** Single source for homepage FAQ UI + JSON-LD. */
export function getHomeFaq(t: Translator): HomeFaqItem[] {
  return FAQ_KEYS.map((n) => ({
    question: t(`home.faq.q${n}`),
    answer: t(`home.faq.a${n}`),
  }));
}
