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
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
