import { SETTINGS_VERSION, type GeminiFXSettings } from "./schema";

export const DEFAULT_SETTINGS: Readonly<GeminiFXSettings> = Object.freeze({
  version: SETTINGS_VERSION,
  enabled: true,
  theme: "chatgpt-inspired-dark",
  accentColor: "#10a37f",
  sidebarWidth: 260,
  contentWidth: 768, // approved proposal P1-C (ChatGPT column width)
  fontSize: 16, // approved proposal P2 (ChatGPT body text size)
  compactMode: false,
});
