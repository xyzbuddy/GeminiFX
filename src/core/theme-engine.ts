import { ROOT_COMPACT_ATTR, ROOT_THEME_ATTR } from "./constants";
import type { GeminiFXSettings } from "../settings/schema";

/**
 * Maps user settings to CSS custom properties on <html>.
 * Only GeminiFX-owned `--geminifx-*` tokens are written; Gemini's own
 * variables are never touched. Switching themes is an attribute change,
 * so it never reloads Gemini or resets the conversation.
 */

export const SETTING_TOKENS = [
  "--geminifx-accent",
  "--geminifx-sidebar-width",
  "--geminifx-content-width",
  "--geminifx-font-size",
] as const;

export function buildTokenOverrides(settings: GeminiFXSettings): Record<(typeof SETTING_TOKENS)[number], string> {
  return {
    "--geminifx-accent": settings.accentColor,
    "--geminifx-sidebar-width": `${settings.sidebarWidth}px`,
    "--geminifx-content-width": `${settings.contentWidth}px`,
    "--geminifx-font-size": `${settings.fontSize}px`,
  };
}

export function applyTheme(root: HTMLElement, settings: GeminiFXSettings): void {
  root.setAttribute(ROOT_THEME_ATTR, settings.theme);
  root.toggleAttribute(ROOT_COMPACT_ATTR, settings.compactMode);
  const tokens = buildTokenOverrides(settings);
  for (const name of SETTING_TOKENS) {
    root.style.setProperty(name, tokens[name]);
  }
}

export function clearTheme(root: HTMLElement): void {
  root.removeAttribute(ROOT_THEME_ATTR);
  root.removeAttribute(ROOT_COMPACT_ATTR);
  for (const name of SETTING_TOKENS) {
    root.style.removeProperty(name);
  }
}
