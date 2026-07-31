/** Adsterra units for 5svg.com — from publisher dashboard */

export const ADSTERRA_SCRIPT_HOST = "effectivecpmnetwork.com";

export const ADSTERRA_NATIVE_BANNER = {
  containerId: "container-60fa24f9c0c8c377a7047fbc6c300492",
  scriptSrc:
    "https://pl30613710.effectivecpmnetwork.com/60fa24f9c0c8c377a7047fbc6c300492/invoke.js",
} as const;

/** Social Bar — insert above closing </body> */
export const ADSTERRA_SOCIAL_BAR = {
  scriptSrc:
    "https://pl30613711.effectivecpmnetwork.com/61/91/de/6191dec98ec370d21dc2f00540cf16f4.js",
} as const;

export type AdsterraIframeBanner = {
  key: string;
  width: number;
  height: number;
  scriptSrc: string;
};

/** Banner 320x50 — mobile */
export const ADSTERRA_BANNER_320x50: AdsterraIframeBanner = {
  key: "f323c30cad54e0f2878829a9fd81aebd",
  width: 320,
  height: 50,
  scriptSrc:
    "https://www.highperformanceformat.com/f323c30cad54e0f2878829a9fd81aebd/invoke.js",
};

/** Banner 728x90 — desktop */
export const ADSTERRA_BANNER_728x90: AdsterraIframeBanner = {
  key: "7900554d0a857630e074f4be846e08fe",
  width: 728,
  height: 90,
  scriptSrc:
    "https://www.highperformanceformat.com/7900554d0a857630e074f4be846e08fe/invoke.js",
};
