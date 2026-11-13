/** Typed settings schema. Bump SETTINGS_VERSION and add a migration in validate.ts when the shape changes. */

export const SETTINGS_VERSION = 2;

export const THEME_IDS = [
  "chatgpt-inspired-dark",
  "oled-black",
  "midnight",
  "minimal-light",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface GeminiFXSettings {
  version: number;
  enabled: boolean;
  theme: ThemeId;
  accentColor: string;
  sidebarWidth: number;
  contentWidth: number;
  fontSize: number;
  compactMode: boolean;
}

export const LIMITS = {
  sidebarWidth: { min: 200, max: 400 },
  contentWidth: { min: 600, max: 1200 },
  fontSize: { min: 12, max: 20 },
} as const;

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && (THEME_IDS as readonly string[]).includes(value);
}

export function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}
