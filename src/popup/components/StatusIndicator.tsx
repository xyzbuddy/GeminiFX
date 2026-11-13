import { GEMINI_ORIGIN } from "../../core/constants";
import type { TabStatus } from "../useActiveTabStatus";

const LEVEL_TEXT = {
  ok: "Active on this Gemini tab",
  degraded: "Active, some Gemini elements not found",
  unsupported: "Gemini layout not recognised",
} as const;

export function StatusIndicator({ tab }: { tab: TabStatus }) {
  let tone: "on" | "off" | "warn" = "off";
  let text: string;
  let detail: string | null = null;

  switch (tab.kind) {
    case "loading":
      text = "Checking current tab…";
      break;
    case "not-gemini":
      text = "Inactive: this tab is not Gemini";
      detail = `Open ${GEMINI_ORIGIN.replace("https://", "")} to use GeminiFX.`;
      break;
    case "no-content-script":
      text = "Inactive: reload the Gemini tab";
      detail = "The tab was opened before GeminiFX was installed or updated.";
      break;
    case "ready": {
      const { enabled, report } = tab.status;
      if (!enabled) {
        text = "Disabled: native Gemini appearance";
      } else {
        text = LEVEL_TEXT[report.level];
        tone = report.level === "ok" ? "on" : "warn";
        if (report.missingRequired.length > 0) detail = `Missing: ${report.missingRequired.join(", ")}`;
      }
      break;
    }
  }

  return (
    <div className={`gfx-status gfx-status--${tone}`} role="status">
      <span className="gfx-status-dot" aria-hidden="true" />
      <div>
        <p className="gfx-status-text">{text}</p>
        {detail && <p className="gfx-status-detail">{detail}</p>}
      </div>
    </div>
  );
}
