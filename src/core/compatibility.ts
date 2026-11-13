/**
 * Turns raw anchor discovery results into a compatibility report.
 * Independent of the DOM so it can be unit-tested and shown in the popup.
 */

export interface AnchorStatus {
  key: string;
  required: boolean;
  found: boolean;
  /** Which selector from the fallback list matched, or null. */
  matchedSelector: string | null;
  /** Number of matches (collection anchors such as messages can have many). */
  count: number;
}

export type CompatibilityLevel = "ok" | "degraded" | "unsupported";

export interface CompatibilityReport {
  level: CompatibilityLevel;
  anchors: AnchorStatus[];
  missingRequired: string[];
  checkedAt: number;
}

/** Without the app root there is nothing to style safely. */
export const CRITICAL_ANCHOR = "appRoot";

export function evaluateCompatibility(anchors: AnchorStatus[], now: number = Date.now()): CompatibilityReport {
  const missingRequired = anchors.filter((a) => a.required && !a.found).map((a) => a.key);
  const critical = anchors.find((a) => a.key === CRITICAL_ANCHOR);
  let level: CompatibilityLevel = "ok";
  if (!critical || !critical.found) level = "unsupported";
  else if (missingRequired.length > 0) level = "degraded";
  return { level, anchors, missingRequired, checkedAt: now };
}
