// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type GtagArgs = [command: string, ...params: unknown[]];
type Gtag = (...args: GtagArgs) => void;

interface Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
}

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_GOOGLE_ANALYTICS_ID?: string;
  readonly PUBLIC_GOOGLE_ANALYTICS_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
