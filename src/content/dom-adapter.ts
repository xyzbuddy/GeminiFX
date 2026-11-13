import { ANCHOR_ATTR } from "../core/constants";
import type { AnchorStatus } from "../core/compatibility";

/**
 * Gemini compatibility adapter.
 *
 * THIS IS THE ONLY FILE THAT KNOWS GEMINI'S DOM. When Gemini changes its markup,
 * update the selector lists here; theme CSS targets the GeminiFX-owned
 * `data-geminifx-anchor="<key>"` attribute, never Gemini's tags or classes.
 *
 * Each anchor lists selectors in priority order (most stable first). The
 * `verified` field records how each anchor was confirmed; see docs/COMPATIBILITY.md.
 */

export type AnchorKey =
  | "appRoot"
  | "sidebar"
  | "mainContent"
  | "topBar"
  | "chatWindow"
  | "chatHistory"
  | "composer"
  | "promptInput"
  | "userQuery"
  | "modelResponse"
  // Sub-anchors inside approved regions (proposal P1). Order in ANCHORS matters:
  // the first definition that matches an element claims it.
  | "zeroStateGlow"
  | "zeroStateHeading"
  | "navItemCurrent"
  | "navItemCurrentPart"
  | "navItem"
  | "userBubble"
  | "inlineCode"
  | "responseActions"
  | "composerContainer"
  | "composerField"
  | "sendButton";

export interface AnchorDefinition {
  key: AnchorKey;
  selectors: readonly string[];
  /** Required anchors make the compatibility report "degraded" when missing. */
  required: boolean;
  /** Collection anchors tag every match (e.g. each message); others tag the first match. */
  multiple: boolean;
  /** Evidence for the primary selector. `false` = not yet observed on the live site. */
  verified: string | false;
}

const LIVE_SIGNED_OUT = "live DOM, signed-out /app, 2026-11-13";
const LIVE_CONVERSATION = "live DOM, signed-out conversation (1 test prompt), 2026-11-13";

export const ANCHORS: readonly AnchorDefinition[] = [
  {
    key: "appRoot",
    selectors: ["chat-app", '[data-test-id="chat-app"]', "main.chat-app"],
    required: true,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Desktop: <bard-sidenav>, rendered ~1s after hydration. Narrow/mobile: an overlay
    // Material drawer <mat-sidenav>, present only while open. Not required, because it is
    // legitimately absent at times. No positional fallback (`:first-child` would match the
    // main content area instead).
    key: "sidebar",
    selectors: ["bard-sidenav", "side-navigation-v2 mat-sidenav"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "mainContent",
    selectors: ["bard-sidenav-content", "#xap-skip-link-target"],
    required: true,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "topBar",
    selectors: ["top-bar-actions"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "chatWindow",
    selectors: ["chat-window"],
    required: true,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "chatHistory",
    selectors: ['[data-test-id="chat-history-container"]', "#chat-history"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "composer",
    selectors: ["input-area-v2", "input-container"],
    required: true,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "promptInput",
    selectors: [
      'rich-textarea [contenteditable="true"][role="textbox"]',
      '.ql-editor[contenteditable="true"]',
      '[contenteditable="true"][aria-label*="prompt" i]',
    ],
    required: true,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Only present inside a conversation.
    key: "userQuery",
    selectors: ["user-query"],
    required: false,
    multiple: true,
    verified: LIVE_CONVERSATION,
  },
  {
    key: "modelResponse",
    selectors: ["model-response"],
    required: false,
    multiple: true,
    verified: LIVE_CONVERSATION,
  },
  {
    // Decorative blue radial glow behind the zero state (painted by its ::before). No children.
    key: "zeroStateGlow",
    selectors: ["chat-window .lm-glow"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    key: "zeroStateHeading",
    selectors: ["assistant-messages-primary h1", ".zero-state-block-container h1"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // The nav item for the page currently shown. On the zero state Gemini marks
    // "New chat" as disabled because you are already there.
    key: "navItemCurrent",
    // side-navigation-content is shared by the desktop sidebar and the mobile drawer.
    selectors: [
      'side-navigation-content [data-test-id="reset-button"] .mdc-list-item--disabled',
      'side-navigation-content .gem-nav-list-item[aria-current="page"]',
    ],
    required: false,
    multiple: true,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Label and icon of the current item, which Gemini dims (opacity 0.3/0.38) because it is "disabled".
    key: "navItemCurrentPart",
    selectors: [
      'side-navigation-content [data-test-id="reset-button"] .mdc-list-item--disabled :is(.mdc-list-item__primary-text, .mat-mdc-list-item-icon)',
    ],
    required: false,
    multiple: true,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // The visible bubble of each user prompt. Excluded in edit mode, where Gemini shows an edit box.
    key: "userBubble",
    selectors: ["user-query .user-query-bubble-with-background:not(.edit-mode)"],
    required: false,
    multiple: true,
    verified: LIVE_CONVERSATION,
  },
  {
    // Inline code only; code blocks (<pre><code>) are a separate, unapproved area.
    key: "inlineCode",
    selectors: ["model-response message-content :not(pre) > code"],
    required: false,
    multiple: true,
    verified: LIVE_CONVERSATION,
  },
  {
    // Redo / Copy / More under each response.
    key: "responseActions",
    selectors: ["model-response message-actions"],
    required: false,
    multiple: true,
    verified: LIVE_CONVERSATION,
  },
  {
    key: "navItem",
    selectors: ["side-navigation-content .gem-nav-list-item", "bard-sidenav .gem-nav-list-item"],
    required: false,
    multiple: true,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Wrapper that limits the composer's width (660px max on the zero state).
    key: "composerContainer",
    selectors: ["input-container .input-area-container"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Padded row inside the composer; its 12px vertical padding sets the 64px height.
    key: "composerField",
    selectors: ["input-area-v2 .text-input-field"],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
  {
    // Only rendered while the prompt has text.
    key: "sendButton",
    selectors: ["input-area-v2 gem-icon-button.send-button button", 'input-area-v2 button[aria-label="Send message"]'],
    required: false,
    multiple: false,
    verified: LIVE_SIGNED_OUT,
  },
];

export type ColorScheme = "dark" | "light";

/**
 * Gemini's own light/dark mode. Gemini toggles `dark-theme` on <body>;
 * if that class convention ever changes, fall back to the body's luminance.
 */
export function detectColorScheme(doc: Document): ColorScheme {
  const body = doc.body;
  if (!body) return "dark";
  if (body.classList.contains("dark-theme")) return "dark";
  if (body.classList.contains("light-theme")) return "light";
  const bg = doc.defaultView?.getComputedStyle(body).backgroundColor ?? "";
  const rgb = bg.match(/\d+(\.\d+)?/g)?.slice(0, 3).map(Number);
  if (!rgb || rgb.length < 3) return "dark";
  const [r, g, b] = rgb as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 128 ? "light" : "dark";
}

function safeQueryAll(root: ParentNode, selector: string): Element[] {
  try {
    return Array.from(root.querySelectorAll(selector));
  } catch {
    // Invalid selector must never crash the extension.
    return [];
  }
}

export function findAnchor(root: ParentNode, def: AnchorDefinition): { selector: string | null; elements: Element[] } {
  for (const selector of def.selectors) {
    const matches = safeQueryAll(root, selector);
    if (matches.length > 0) {
      return { selector, elements: def.multiple ? matches : matches.slice(0, 1) };
    }
  }
  return { selector: null, elements: [] };
}

/** Discover anchors without modifying the page. */
export function scanAnchors(root: ParentNode, defs: readonly AnchorDefinition[] = ANCHORS): AnchorStatus[] {
  return defs.map((def) => {
    const { selector, elements } = findAnchor(root, def);
    return {
      key: def.key,
      required: def.required,
      found: elements.length > 0,
      matchedSelector: selector,
      count: elements.length,
    };
  });
}

/**
 * Discover anchors and mark them with `data-geminifx-anchor`.
 *  - Idempotent: an element already carrying the right value is left alone.
 *  - One element, one anchor: the first definition to match an element claims it,
 *    so a broad fallback can never overwrite (or be overwritten by) another anchor.
 *  - Stale tags (elements that no longer match their anchor) are removed.
 * Adding an attribute does not alter Gemini's behavior or event handling.
 */
export function tagAnchors(root: ParentNode, defs: readonly AnchorDefinition[] = ANCHORS): AnchorStatus[] {
  const claimed = new Set<Element>();
  const keep = new Set<Element>();

  const statuses = defs.map((def) => {
    const found = findAnchor(root, def);
    const elements = found.elements.filter((el) => !claimed.has(el));
    for (const el of elements) {
      claimed.add(el);
      keep.add(el);
      if (el.getAttribute(ANCHOR_ATTR) !== def.key) el.setAttribute(ANCHOR_ATTR, def.key);
    }
    return {
      key: def.key,
      required: def.required,
      found: elements.length > 0,
      matchedSelector: elements.length > 0 ? found.selector : null,
      count: elements.length,
    };
  });

  for (const el of safeQueryAll(root, `[${ANCHOR_ATTR}]`)) {
    if (!keep.has(el)) el.removeAttribute(ANCHOR_ATTR);
  }
  return statuses;
}

/** Remove every GeminiFX anchor attribute (used when disabling). */
export function untagAll(root: ParentNode): void {
  for (const el of safeQueryAll(root, `[${ANCHOR_ATTR}]`)) {
    el.removeAttribute(ANCHOR_ATTR);
  }
}
