import { STORAGE_KEY } from "../core/constants";
import { DEFAULT_SETTINGS } from "./defaults";
import type { GeminiFXSettings } from "./schema";
import { sanitizeSettings } from "./validate";

/** chrome.storage.local wrapper. All values pass through sanitizeSettings. */

function storageArea(): chrome.storage.StorageArea | null {
  try {
    return globalThis.chrome?.storage?.local ?? null;
  } catch {
    // Accessing chrome.* throws after the extension is reloaded/uninstalled
    // while an old content script is still alive.
    return null;
  }
}

export async function loadSettings(): Promise<GeminiFXSettings> {
  const area = storageArea();
  if (!area) return { ...DEFAULT_SETTINGS };
  try {
    const result = await area.get(STORAGE_KEY);
    return sanitizeSettings(result[STORAGE_KEY]);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(patch: Partial<GeminiFXSettings>): Promise<GeminiFXSettings> {
  const current = await loadSettings();
  const next = sanitizeSettings({ ...current, ...patch });
  const area = storageArea();
  if (area) await area.set({ [STORAGE_KEY]: next });
  return next;
}

export async function resetSettings(): Promise<GeminiFXSettings> {
  const next = { ...DEFAULT_SETTINGS };
  const area = storageArea();
  if (area) await area.set({ [STORAGE_KEY]: next });
  return next;
}

/** Ensure a valid, current-version object is stored (used on install/update). */
export async function ensureStoredSettings(): Promise<GeminiFXSettings> {
  const area = storageArea();
  const settings = await loadSettings();
  if (area) await area.set({ [STORAGE_KEY]: settings });
  return settings;
}

/** Subscribe to settings changes from any extension context. Returns an unsubscribe function. */
export function onSettingsChanged(listener: (settings: GeminiFXSettings) => void): () => void {
  const onChanged = globalThis.chrome?.storage?.onChanged;
  if (!onChanged) return () => {};
  const handler = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
    if (areaName !== "local" || !(STORAGE_KEY in changes)) return;
    listener(sanitizeSettings(changes[STORAGE_KEY]?.newValue));
  };
  onChanged.addListener(handler);
  return () => {
    try {
      onChanged.removeListener(handler);
    } catch {
      /* extension context already gone */
    }
  };
}
