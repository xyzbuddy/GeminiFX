import type { CompatibilityReport } from "../core/compatibility";

/** Messages between the popup and the content script. */

export interface GetStatusRequest {
  type: "geminifx:get-status";
}

export interface StatusResponse {
  enabled: boolean;
  report: CompatibilityReport;
  url: string;
}
