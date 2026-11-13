# Architecture

```
manifest.json (MV3)
├── content.js        (IIFE, document_start, gemini.google.com only)
│   content/index.ts ─┬─ core/settings-manager ── settings/storage ── chrome.storage.local
│                     ├─ core/ui-engine ── core/theme-engine   (<style id="geminifx-style">, <html> attrs + tokens)
│                     ├─ content/dom-adapter                    (ONLY place with Gemini selectors)
│                     ├─ content/observer                       (debounced childList MutationObserver)
│                     ├─ content/route-handler                  (popstate + URL check after DOM batches)
│                     └─ core/compatibility                     (anchor report for the popup)
├── service-worker.js (ES module) → writes validated/migrated settings on install/update
└── popup/index.html  (React) → reads/writes settings, asks content script for status
```

## Data flow

1. The content script loads settings. If enabled, `UiEngine.enable()` injects the stylesheet and sets `data-geminifx="on"`, `data-geminifx-theme`, and `--geminifx-*` inline tokens on `<html>`.
2. `tagAnchors()` adds `data-geminifx-anchor` to discovered Gemini elements. The observer re-runs it, debounced, when Gemini adds or removes nodes. It ignores attribute mutations, so tagging never loops.
3. The popup writes settings with `saveSettings()`. `chrome.storage.onChanged` reaches the content script, which re-applies them without a page reload.
4. Disable stops the observer, removes all anchor attributes, the style element, and all root attributes and tokens. The page returns to native Gemini.

## Styling layers

| File | Contains | Names Gemini internals? |
|---|---|---|
| `src/themes/tokens.css` | sizes, radii, fonts | no |
| `src/themes/chatgpt-inspired-dark.css` | color tokens for dark and `[data-geminifx-scheme="light"]` | no (selectors are only `html[...]`) |
| `src/themes/gemini-bridge.css` | maps anchors and Gemini's color variables onto tokens | yes: the CSS half of the adapter |

All three are concatenated into the single `<style id="geminifx-style">`. `tests/styles.test.ts` enforces that every rule is scoped under `html[data-geminifx="on"]`, the theme file has no element selectors, the bridge only uses anchors that exist, both schemes define the same tokens, and there is no `!important`.

**Specificity.** Some Gemini component rules reach (0,5,0). Bridge rules that must win end in `:not(#gfx)`. No element has that id, so it matches everything and adds ID-level specificity. This beats Gemini's class-based rules without `!important`, and `!important` stays available to Gemini and users.

**Light/dark.** `detectColorScheme()` (adapter) reads Gemini's `<body>` class. The content script sets `data-geminifx-scheme` and watches `<body class>` with a separate attribute observer, because the main observer only sees childList changes.

## Isolation rules

- Gemini selectors: `src/content/dom-adapter.ts` only (CSS-side Gemini names: `gemini-bridge.css` only).
- Theme CSS: scoped under `html[data-geminifx="on"]`; theme files contain token values only.
- Settings: typed in `settings/schema.ts`, validated by `settings/validate.ts` (never throws; clamps; drops unknown keys; migrates by `version`).
- No network, no page-world script injection, no `history` patching, no prompt access.

## Build

- `vite.config.ts`: popup + service worker → `extension/` (stable file names, no hashes).
- `vite.content.config.ts`: content script as a single IIFE → `extension/content.js` (MV3 content scripts can't be ES modules). CSS is inlined via `?inline` so it can be removed on disable.
- `scripts/verify-build.mjs` fails the build if the manifest isn't MV3, references a missing file, requests extra permissions, or has a version different from package.json.

## Deviations from the proposed structure

- `settings/validate.ts` was added to avoid an import cycle between `schema.ts` and `defaults.ts`.
- `src/types/messages.ts` replaces `src/types/chrome.d.ts`; Chrome types come from `@types/chrome`.
- `popup/components/StatusIndicator.tsx` replaces `ThemeSelector.tsx` for now. A theme selector with no implemented themes would be placeholder UI, which the brief forbids. It returns with P1 presets.
- `chatgpt-inspired-dark.css` exists (approved P1) and also carries the approved light variant. The other preset files (`oled-black`, `midnight`, `minimal-light`) are not created until their designs are approved.
- `gemini-bridge.css` was added to keep Gemini's internal names out of theme files.
- `tsconfig.node.json` type-checks the Vite configs with Node types, kept separate from the browser code.
