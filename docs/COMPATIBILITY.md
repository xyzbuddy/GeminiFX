# Gemini compatibility

All Gemini-specific selectors live in `src/content/dom-adapter.ts`. Each anchor has a fallback list (most stable first). When an anchor is found, the adapter adds `data-geminifx-anchor="<key>"` to it, and theme CSS targets only that attribute.

## Anchor status

Verified 2026-11-13 on the live site at `https://gemini.google.com/app`, **signed out**, desktop viewport, zero-state (no conversation). Method: the built `dist/content.js` was run in the page with a stubbed `chrome` API. All required anchors matched their primary selector, the report was `ok`, and disable removed every attribute, token and style.

| Key | Required | Primary selector | Fallbacks | Status |
|---|---|---|---|---|
| `appRoot` | yes | `chat-app` | `[data-test-id="chat-app"]`, `main.chat-app` | Verified (signed out) |
| `sidebar` | no (absent at times) | `bard-sidenav` | `side-navigation-v2 mat-sidenav` (mobile drawer) | Verified (signed out): desktop collapsed/expanded, mobile 375 px drawer |
| `mainContent` | yes | `bard-sidenav-content` | `#xap-skip-link-target` | Verified (signed out) |
| `topBar` | no | `top-bar-actions` | none | Verified (signed out) |
| `chatWindow` | yes | `chat-window` | none | Verified (signed out) |
| `chatHistory` | no | `[data-test-id="chat-history-container"]` | `#chat-history` | Verified (signed out) |
| `composer` | yes | `input-area-v2` | `input-container` | Verified (signed out) |
| `promptInput` | yes | `rich-textarea [contenteditable="true"][role="textbox"]` | `.ql-editor[contenteditable="true"]`, `[contenteditable="true"][aria-label*="prompt" i]` | Verified (signed out) |
| `userQuery` | no | `user-query` | none | Verified (signed-out conversation, 1 test prompt) |
| `modelResponse` | no | `model-response` | none | Verified (signed-out conversation, 1 test prompt) |

### Sub-anchors used by the approved P1 theme (all verified signed out, 2026-11-13)

The first anchor that matches an element claims it, so order in `ANCHORS` matters (`navItemCurrent` comes before `navItem`).

| Key | Primary selector | Fallback | Notes |
|---|---|---|---|
| `zeroStateGlow` | `chat-window .lm-glow` | none | Decorative blue radial gradient (`::before`), no children |
| `zeroStateHeading` | `assistant-messages-primary h1` | `.zero-state-block-container h1` | "Hi, I'm Gemini…" |
| `navItemCurrent` | `side-navigation-content [data-test-id="reset-button"] .mdc-list-item--disabled` | `side-navigation-content .gem-nav-list-item[aria-current="page"]` | Gemini marks the current page's item as disabled (opacity 0.3) |
| `navItem` | `side-navigation-content .gem-nav-list-item` | `bard-sidenav .gem-nav-list-item` | `side-navigation-content` is shared by the desktop sidebar and the mobile drawer |
| `composerContainer` | `input-container .input-area-container` | none | Holds Gemini's `max-width: 660px` |
| `composerField` | `input-area-v2 .text-input-field` | none | 12 px vertical padding → 64 px composer |
| `navItemCurrentPart` | `side-navigation-content [data-test-id="reset-button"] .mdc-list-item--disabled :is(.mdc-list-item__primary-text, .mat-mdc-list-item-icon)` | none | Label and icon Gemini dims on the current item |
| `userBubble` | `user-query .user-query-bubble-with-background:not(.edit-mode)` | none | Verified in a conversation. Gemini: `#171717`, 40 px radius, padding 20/28, max-width 452 px. Edit mode excluded |
| `inlineCode` | `model-response message-content :not(pre) > code` | none | Verified in a conversation. Code blocks (`pre > code`) deliberately excluded |
| `responseActions` | `model-response message-actions` | none | Verified in a conversation. Redo / Copy / More |
| `sendButton` | `input-area-v2 gem-icon-button.send-button button` | `input-area-v2 button[aria-label="Send message"]` | Exists only while the prompt has text |

### Gemini variables re-pointed by `src/themes/gemini-bridge.css`

`--lumi-sys-color--surface`, `--bard-color-synthetic--chat-window-surface`, `--gem-sys-color--surface`, `--lumi-sys-color--on-surface`, `--gem-sys-color--on-surface`, `--lumi-sys-color--on-surface-variant`, `--gem-sys-color--on-surface-variant`, `--lumi-sys-color-states--hover-on-surface` (inside `appRoot`); `--lumi-sys-color--surface-bright`, `--bard-color-sidenav-background-desktop/-mobile` (inside `sidebar`); `--gem-sys-color--surface-bright`, `--single-line-border-radius`, `--mat-icon-button-icon-color` (inside `composer`). If Gemini renames these, colors fall back to Gemini's own; nothing breaks functionally.

Light/dark: `detectColorScheme()` reads `body.dark-theme` / `body.light-theme` (verified both, with Gemini's Theme set to "System"), and falls back to body background luminance.

## Not yet verified

- Signed-in layout (conversation list, account menu, Gems). The signed-out sidebar shows a sign-in prompt instead of history.
- Code blocks, tables, lists, citations and images inside responses: the test reply only contained a sentence with inline code.
- Narrow/mobile viewport structure.
- Client-side route changes between conversations (logic is unit-tested on a mock, not on the live site).

## Observations

### Shell (desktop 1440×900, signed out, dark, measured 2026-11-13)

- `<bard-sidenav>` is rendered **about 1 s after hydration**. Until then `bard-sidenav-container` holds only `bard-sidenav-content`, so the report is briefly `degraded` until the observer rescans. A positional fallback (`:first-child`) used to match the main content in that window, so it was removed. `tagAnchors` now also gives each element to only one anchor and clears stale tags.
- Collapsed sidebar: a 52 px icon rail, background `#0f0f0f` (same as the page). Main content starts at x = 52.
- Expanded sidebar ("Open sidebar" / "Close sidebar" toggle, `[data-test-id="side-nav-menu-button"]`): 288 px, inner panel `#1f1f1f`, with no overlay at desktop width. Main content shifts to x = 288.
- Page background `#0f0f0f` on `body`. `chat-app`, `main` and `chat-window` are transparent.
- Composer `input-area-v2`: 660 px wide, background `#1e1f20`, radius 40 px, about 72 px tall, horizontally centred in the main area.
- Top bar `top-bar-actions`: top-right cluster (~129×48), not a full-width header.
- Gemini's UI font is Google Sans Flex (Google Sans fallback) on the prompt input.

- Gemini already ships its own dark theme (`body.dark-theme`) and uses Angular custom elements plus generated `ng-tns-*` classes. Never select on `ng-*` classes; they change between builds.
- Several `data-test-id` attributes exist (`chat-app`, `chat-history-container`, `side-nav-sparkle-button`, `bard-mode-menu-button`, ...). Prefer them as fallbacks.
- Native controls seen in the composer: "Upload & tools", mode picker, "Dictate", plus a temporary-chat toggle in the top bar. GeminiFX must not alter their behavior.

## When Gemini changes

1. The popup shows "some Gemini elements not found" and lists missing anchors.
2. Inspect the live DOM, update only the selector list in `dom-adapter.ts`, and update the fixture in `tests/compatibility.test.ts` and this table.
3. Theme CSS should not need changes, because it targets anchors.
