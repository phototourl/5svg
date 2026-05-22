// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type GtagArgs = [command: string, ...params: unknown[]];
type Gtag = (...args: GtagArgs) => void;

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  namespace App {
    // interface Error {}
    interface Locals {
      locale: import("@/lib/i18n/config").AppLocale;
      pathnameWithoutLocale: string;
    }
    interface PageData {
      locale?: import("@/lib/i18n/config").AppLocale;
      messages?: import("@/lib/i18n/messages").Messages;
      gaId?: string | null;
      gaInlineScript?: string | null;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
