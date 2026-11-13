import { DEFAULT_SETTINGS } from "./defaults";
import {
  LIMITS,
  SETTINGS_VERSION,
  isHexColor,
  isThemeId,
  type GeminiFXSettings,
} from "./schema";

type Raw = Record<string, unknown>;

function isRecord(value: unknown): value is Raw {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/**
 * Upgrade older stored shapes to the current version, one step at a time.
 *  v0 → v1: no `version` field; same keys.
 *  v1 → v2: the defaults changed to the owner-approved values (fontSize 15 → 16, P2;
 *           contentWidth 800 → 768, P1-C). Only values still equal to the OLD default
 *           move; a value the user picked themselves is kept.
 */
export function migrateSettings(raw: Raw): Raw {
  let out = { ...raw };
  let version = typeof out.version === "number" ? out.version : 0;
  if (version < 1) {
    version = 1;
  }
  if (version < 2) {
    if (out.fontSize === 15) out.fontSize = 16;
    if (out.contentWidth === 800) out.contentWidth = 768;
    version = 2;
  }
  out.version = version;
  return out;
}

/**
 * Turn any stored or imported value into a complete, valid settings object.
 * Unknown keys are dropped; invalid values fall back to defaults; numbers are clamped.
 * Never throws.
 */
export function sanitizeSettings(input: unknown): GeminiFXSettings {
  const raw = isRecord(input) ? migrateSettings(input) : {};
  const d = DEFAULT_SETTINGS;
  return {
    version: SETTINGS_VERSION,
    enabled: typeof raw.enabled === "boolean" ? raw.enabled : d.enabled,
    theme: isThemeId(raw.theme) ? raw.theme : d.theme,
    accentColor: isHexColor(raw.accentColor) ? raw.accentColor.toLowerCase() : d.accentColor,
    sidebarWidth: clampInt(raw.sidebarWidth, LIMITS.sidebarWidth.min, LIMITS.sidebarWidth.max, d.sidebarWidth),
    contentWidth: clampInt(raw.contentWidth, LIMITS.contentWidth.min, LIMITS.contentWidth.max, d.contentWidth),
    fontSize: clampInt(raw.fontSize, LIMITS.fontSize.min, LIMITS.fontSize.max, d.fontSize),
    compactMode: typeof raw.compactMode === "boolean" ? raw.compactMode : d.compactMode,
  };
}
