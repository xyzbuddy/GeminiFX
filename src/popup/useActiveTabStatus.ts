import { useCallback, useEffect, useState } from "react";
import { GEMINI_ORIGIN, MESSAGE_GET_STATUS } from "../core/constants";
import type { StatusResponse } from "../types/messages";

export type TabStatus =
  | { kind: "loading" }
  | { kind: "not-gemini" }
  | { kind: "no-content-script" }
  | { kind: "ready"; status: StatusResponse };

/**
 * Asks the content script in the active tab for its status.
 * `tab.url` is only visible for gemini.google.com (our sole host permission),
 * so any other tab correctly reads as "not Gemini".
 */
export function useActiveTabStatus(): { tab: TabStatus; refresh: () => Promise<void> } {
  const [tab, setTab] = useState<TabStatus>({ kind: "loading" });

  const refresh = useCallback(async () => {
    try {
      const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!active?.id || !active.url?.startsWith(`${GEMINI_ORIGIN}/`)) {
        setTab({ kind: "not-gemini" });
        return;
      }
      const status = (await chrome.tabs.sendMessage(active.id, { type: MESSAGE_GET_STATUS })) as
        | StatusResponse
        | undefined;
      setTab(status ? { kind: "ready", status } : { kind: "no-content-script" });
    } catch {
      // No listener: tab was open before the extension was installed/reloaded.
      setTab({ kind: "no-content-script" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { tab, refresh };
}
