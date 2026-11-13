# GeminiFX: agent instructions

GeminiFX is an MV3 Chrome extension that restyles gemini.google.com with a ChatGPT-inspired look. **Change the UI, not the AI.**

## Before any work

1. Read the full specification: `docs/spec/PROJECT_BRIEF.md` (main spec) and `docs/spec/AGENT_WORKFLOW_BRIEF.md` (workflow and skill rules). `README.md` is the user-facing summary.
2. Read `docs/DESIGN_DECISIONS.md` to see what is approved, pending, or rejected.
3. Inspect the existing code before proposing changes. Continue from its actual state; do not restart or overwrite working code.
4. Discover the skills that are actually available (project `.claude/skills/` and global). Load the relevant ones. Never claim a skill is active unless the environment confirms it.

## Mandatory rules

- **UI work → load the `geminifx-ui-approval` skill first.** No production CSS for any visual area until the owner has supplied a reference and explicitly approved a written proposal. Silence or "ok" to something else is not approval. Approval for one component never covers another.
- **Preserve Gemini.** Never intercept prompts or network, call private APIs, touch Gemini's JS/React/Angular state, or replace native controls. Prefer CSS on GeminiFX anchors.
- **Selectors live only in `src/content/dom-adapter.ts`.** CSS targets `[data-geminifx-anchor="<key>"]`, never Gemini tags or classes. The only exception is `src/themes/gemini-bridge.css`, the CSS half of the adapter, which may name Gemini's color variables, `<body>`, and the icon-font/code exclusions in the font rule. Theme files contain token values only. Never invent selectors: verify on the live page and record evidence in `docs/COMPATIBILITY.md`.
- **No backend, telemetry, or extra permissions.** Permissions are `storage` + `https://gemini.google.com/*` only.
- **No placeholder UI.** A visible control must work.
- **Finish P0 before P1/P2.**

## Commands

```bash
npm install
npm run typecheck
npm test
npm run build      # typecheck + vite builds + scripts/verify-build.mjs → dist/
```

Load `dist/` via chrome://extensions → Developer mode → Load unpacked.

## After work

- Run typecheck, tests, and build. Report failures accurately.
- Update `docs/` (ARCHITECTURE, COMPATIBILITY, DESIGN_DECISIONS) and `CHANGELOG.md` when behavior changes.
- Report changed files and separate: implemented / build-verified / tested in a real browser / not tested.
