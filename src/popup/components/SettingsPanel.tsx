import type { GeminiFXSettings } from "../../settings/schema";
import { Toggle } from "./Toggle";

interface SettingsPanelProps {
  settings: GeminiFXSettings;
  onToggleEnabled: (enabled: boolean) => void;
  onReset: () => void;
}

/**
 * P0 controls only. Theme, accent, width, font-size and density controls are
 * P1 and are intentionally not shown until their features exist (no placeholder UI).
 */
export function SettingsPanel({ settings, onToggleEnabled, onReset }: SettingsPanelProps) {
  return (
    <section className="gfx-panel" aria-label="Settings">
      <Toggle label="Enable GeminiFX" checked={settings.enabled} onChange={onToggleEnabled} />
      <button type="button" className="gfx-button" onClick={onReset}>
        Reset to defaults
      </button>
    </section>
  );
}
