import type { Messages } from "./messages";

type TranslateValues = Record<string, string | number>;

function lookup(messages: Messages, key: string): string | undefined {
  const parts = key.split(".");
  let cur: unknown = messages;
  for (const part of parts) {
    if (!cur || typeof cur !== "object" || !(part in cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, values?: TranslateValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = values[name];
    return v === undefined ? `{${name}}` : String(v);
  });
}

export function createTranslator(messages: Messages) {
  return function t(key: string, values?: TranslateValues): string {
    const raw = lookup(messages, key);
    if (raw === undefined) return key;
    return interpolate(raw, values);
  };
}

export type Translator = ReturnType<typeof createTranslator>;
