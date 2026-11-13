import { useEffect, useState } from "react";
import type { GeminiFXSettings } from "../settings/schema";
import { loadSettings, onSettingsChanged, resetSettings, saveSettings } from "../settings/storage";
import { SettingsPanel } from "./components/SettingsPanel";
import { StatusIndicator } from "./components/StatusIndicator";
import { useActiveTabStatus } from "./useActiveTabStatus";

/*
 * PROVISIONAL popup. Functionality is final for P0 (enable/disable, reset,
 * status); visual design is PENDING owner approval (docs/DESIGN_DECISIONS.md).
 */
export function App() {
  const [settings, setSettings] = useState<GeminiFXSettings | null>(null);
  const { tab, refresh } = useActiveTabStatus();
  const version = chrome.runtime.getManifest().version;

  useEffect(() => {
    void loadSettings().then(setSettings);
    return onSettingsChanged((next) => {
      setSettings(next);
      // Content script applies changes asynchronously; re-query its status shortly after.
      setTimeout(() => void refresh(), 150);
    });
  }, [refresh]);

  return (
    <main className="gfx-popup">
      <header className="gfx-header">
        <img src="../icons/icon-32.png" width={24} height={24} alt="" />
        <h1>GeminiFX</h1>
        <span className="gfx-version">v{version}</span>
      </header>

      <StatusIndicator tab={tab} />

      {settings && (
        <SettingsPanel
          settings={settings}
          onToggleEnabled={(enabled) => void saveSettings({ enabled })}
          onReset={() => void resetSettings()}
        />
      )}

      <footer className="gfx-footer">
        Unofficial community project. Not affiliated with Google or OpenAI.
      </footer>
    </main>
  );
}
