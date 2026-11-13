import { DEFAULT_SETTINGS } from "../settings/defaults";
import type { GeminiFXSettings } from "../settings/schema";
import { loadSettings, onSettingsChanged } from "../settings/storage";

type Listener = (settings: GeminiFXSettings) => void;

/** Holds the current settings for a content-script instance and fans out changes. */
export class SettingsManager {
  private current: GeminiFXSettings = { ...DEFAULT_SETTINGS };
  private listeners = new Set<Listener>();
  private unsubscribe: (() => void) | null = null;

  get settings(): GeminiFXSettings {
    return this.current;
  }

  async init(): Promise<GeminiFXSettings> {
    this.current = await loadSettings();
    this.unsubscribe ??= onSettingsChanged((next) => {
      this.current = next;
      for (const listener of this.listeners) listener(next);
    });
    return this.current;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispose(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.listeners.clear();
  }
}
