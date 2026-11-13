import { beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "../src/core/constants";
import { DEFAULT_SETTINGS } from "../src/settings/defaults";
import { SETTINGS_VERSION } from "../src/settings/schema";
import { sanitizeSettings } from "../src/settings/validate";

describe("sanitizeSettings", () => {
  it("returns defaults for non-object input", () => {
    for (const input of [undefined, null, 42, "x", [1, 2]]) {
      expect(sanitizeSettings(input)).toEqual(DEFAULT_SETTINGS);
    }
  });

  it("keeps valid values and drops unknown keys", () => {
    const result = sanitizeSettings({
      enabled: false,
      theme: "midnight",
      accentColor: "#AABBCC",
      sidebarWidth: 300,
      contentWidth: 900,
      fontSize: 16,
      compactMode: true,
      evil: "<script>",
    });
    expect(result).toEqual({
      version: SETTINGS_VERSION,
      enabled: false,
      theme: "midnight",
      accentColor: "#aabbcc",
      sidebarWidth: 300,
      contentWidth: 900,
      fontSize: 16,
      compactMode: true,
    });
    expect(result).not.toHaveProperty("evil");
  });

  it("falls back on invalid theme, colour and types", () => {
    const result = sanitizeSettings({
      enabled: "yes",
      theme: "hacker-green",
      accentColor: "red; background:url(x)",
      fontSize: "big",
    });
    expect(result.enabled).toBe(DEFAULT_SETTINGS.enabled);
    expect(result.theme).toBe(DEFAULT_SETTINGS.theme);
    expect(result.accentColor).toBe(DEFAULT_SETTINGS.accentColor);
    expect(result.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
  });

  it("clamps and rounds numeric ranges", () => {
    const result = sanitizeSettings({ sidebarWidth: 9999, contentWidth: -5, fontSize: 14.6 });
    expect(result.sidebarWidth).toBe(400);
    expect(result.contentWidth).toBe(600);
    expect(result.fontSize).toBe(15);
  });

  it("rejects NaN and Infinity", () => {
    const result = sanitizeSettings({ sidebarWidth: NaN, fontSize: Infinity });
    expect(result.sidebarWidth).toBe(DEFAULT_SETTINGS.sidebarWidth);
    expect(result.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
  });

  it("v1 → v2 moves old defaults to the approved values (font 16, width 768)", () => {
    const result = sanitizeSettings({ version: 1, fontSize: 15, contentWidth: 800, enabled: false });
    expect(result.fontSize).toBe(16);
    expect(result.contentWidth).toBe(768);
    expect(result.enabled).toBe(false);
    expect(result.version).toBe(2);
  });

  it("v1 → v2 keeps values the user chose themselves", () => {
    const result = sanitizeSettings({ version: 1, fontSize: 18, contentWidth: 900 });
    expect(result.fontSize).toBe(18);
    expect(result.contentWidth).toBe(900);
  });

  it("v2 values are never re-migrated", () => {
    expect(sanitizeSettings({ version: 2, fontSize: 15 }).fontSize).toBe(15);
  });

  it("migrates unversioned (v0) settings to the current version", () => {
    const result = sanitizeSettings({ enabled: false });
    expect(result.version).toBe(SETTINGS_VERSION);
    expect(result.enabled).toBe(false);
  });
});

describe("storage", () => {
  let store: Record<string, unknown>;

  beforeEach(() => {
    store = {};
    vi.resetModules();
    vi.stubGlobal("chrome", {
      storage: {
        local: {
          get: vi.fn(async (key: string) => (key in store ? { [key]: store[key] } : {})),
          set: vi.fn(async (items: Record<string, unknown>) => Object.assign(store, items)),
        },
        onChanged: { addListener: vi.fn(), removeListener: vi.fn() },
      },
    });
  });

  it("loads defaults when nothing is stored", async () => {
    const { loadSettings } = await import("../src/settings/storage");
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("merges, validates and persists a patch", async () => {
    const { saveSettings, loadSettings } = await import("../src/settings/storage");
    await saveSettings({ enabled: false, fontSize: 99 });
    const loaded = await loadSettings();
    expect(loaded.enabled).toBe(false);
    expect(loaded.fontSize).toBe(20);
    expect(loaded.theme).toBe(DEFAULT_SETTINGS.theme);
  });

  it("resets to defaults", async () => {
    const { saveSettings, resetSettings } = await import("../src/settings/storage");
    await saveSettings({ enabled: false });
    await resetSettings();
    expect(store[STORAGE_KEY]).toEqual(DEFAULT_SETTINGS);
  });

  it("repairs corrupted stored data on load", async () => {
    store[STORAGE_KEY] = "not an object";
    const { loadSettings } = await import("../src/settings/storage");
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("falls back to defaults when chrome.storage is unavailable", async () => {
    vi.stubGlobal("chrome", undefined);
    const { loadSettings } = await import("../src/settings/storage");
    expect(await loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it("notifies listeners only for GeminiFX keys in local storage", async () => {
    const { onSettingsChanged } = await import("../src/settings/storage");
    const listener = vi.fn();
    onSettingsChanged(listener);
    const handler = (chrome.storage.onChanged.addListener as ReturnType<typeof vi.fn>).mock.calls[0]![0];
    handler({ other: { newValue: 1 } }, "local");
    handler({ [STORAGE_KEY]: { newValue: { enabled: false } } }, "sync");
    expect(listener).not.toHaveBeenCalled();
    handler({ [STORAGE_KEY]: { newValue: { enabled: false } } }, "local");
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });
});
