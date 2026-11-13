# Changelog

## [Unreleased]

### Added
- **ChatGPT-style theme (approved proposal P1):** black shell with the blue glow removed, black sidebar with a faint divider, 36 px nav items with `#1a1a1a` hover/current state, 768 × 52 px pill composer, white Send button, 28 px system-font heading, and the system font stack throughout (icons and code excluded).
- **Conversation styling (P1-E):** green user bubble (`#2c6732` / `#effaf3`, 20 px radius), plain `#ededed` responses, `#1b1b1b` inline code, `#afafaf` response action icons. Message selectors verified on a live conversation.
- **Light variant (P1-F):** follows Gemini's own light/dark mode live.
- Mobile drawer (`mat-sidenav`) support in the adapter.
- Adapter sub-anchors: `zeroStateGlow`, `zeroStateHeading`, `navItemCurrent`, `navItemCurrentPart`, `navItem`, `composerContainer`, `composerField`, `sendButton`, `userBubble`, `inlineCode`, `responseActions`; `detectColorScheme()`.
- `src/themes/gemini-bridge.css`, which keeps Gemini variable names out of theme files.
- `tests/styles.test.ts` guards CSS scoping, token completeness, and no `!important`.
- Extension foundation: Manifest V3, Vite + React + TypeScript, `storage` permission and `gemini.google.com` only.
- Typed, versioned settings with validation, migration, persistence, reset, and live updates.
- Content script with a Gemini DOM adapter, debounced observer, route detection, duplicate-init guard, and full clean-up on disable.
- Compatibility report surfaced in the popup.
- Provisional popup: enable/disable, reset to defaults, active-tab status.
- Build verification script, unit tests, docs, `CLAUDE.md`, and the `geminifx-ui-approval` skill.

### Changed
- Default content width is 768 px (approved P1-C), down from 800.
- **Type sizes (approved P2):** response text 16 px / 26 px, user bubble text 16 px, sidebar text 14 px (Gemini: 17/24, 17, 13). Default `fontSize` is 16.
- Settings schema v2: existing installs with the old defaults (`fontSize` 15, `contentWidth` 800) migrate to 16 / 768; values the user chose are kept.
- Conversation column stays at Gemini's 708 px (owner decision, 2026-11-13); the composer keeps the approved 768 px.
- The `sidebar` anchor is optional: Gemini removes it on narrow screens and briefly after load.

### Fixed
- Adapter no longer mis-tags the main content as `sidebar` before Gemini renders `<bard-sidenav>` (about 1 s after load). Each element now gets only one anchor, and stale tags are removed.

### Not yet done

- Popup visuals and the extension icon: not yet designed or approved.
