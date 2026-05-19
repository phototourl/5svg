import { browser } from "$app/environment";
import { mode } from "mode-watcher";

/** Same effective theme as toggleMode / ModeWatcher derivedMode. */
export function getIsDark(): boolean {
  if (mode.current === "dark") return true;
  if (mode.current === "light") return false;
  if (browser) return document.documentElement.classList.contains("dark");
  return false;
}
