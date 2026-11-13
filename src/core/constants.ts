/** Shared constants. No Gemini-specific selectors belong here (see content/dom-adapter.ts). */

export const STORAGE_KEY = "geminifx:settings";

/** Origin GeminiFX is allowed to run on. Must match manifest host_permissions. */
export const GEMINI_ORIGIN = "https://gemini.google.com";

/** <style> element owned by GeminiFX. Removed entirely when disabled. */
export const STYLE_ELEMENT_ID = "geminifx-style";

/** Attributes GeminiFX sets on <html>. All are removed when disabled. */
export const ROOT_ENABLED_ATTR = "data-geminifx";
export const ROOT_THEME_ATTR = "data-geminifx-theme";
export const ROOT_COMPACT_ATTR = "data-geminifx-compact";
/** "dark" | "light", mirrors Gemini's own mode (see dom-adapter detectColorScheme). */
export const ROOT_SCHEME_ATTR = "data-geminifx-scheme";

/**
 * Attribute GeminiFX adds to discovered Gemini elements so CSS can target a
 * stable GeminiFX-owned hook instead of Gemini's internal tag/class names.
 */
export const ANCHOR_ATTR = "data-geminifx-anchor";

export const MESSAGE_GET_STATUS = "geminifx:get-status";

export const OBSERVER_DEBOUNCE_MS = 120;
