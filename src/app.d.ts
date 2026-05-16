// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

type GtagArgs = [command: string, ...params: unknown[]];
type Gtag = (...args: GtagArgs) => void;

interface Window {
  dataLayer?: unknown[];
  gtag?: Gtag;
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
