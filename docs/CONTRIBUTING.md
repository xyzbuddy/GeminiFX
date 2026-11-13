# Contributing

Thanks for helping. GeminiFX is an independent community project, not affiliated with Google or OpenAI.

## Principles

- **Change the UI, not the AI.** No prompt interception, network interception, private APIs, or replacing native controls.
- Keep pull requests small and focused.
- Gemini selectors go only in `src/content/dom-adapter.ts`, with evidence added to `docs/COMPATIBILITY.md`.
- Theme CSS targets `[data-geminifx-anchor]` under `html[data-geminifx="on"]`.
- Visual changes need owner approval and an entry in `docs/DESIGN_DECISIONS.md`. Include before/after screenshots.
- Don't add permissions or dependencies without explaining why in the PR.
- Never include private conversations, personal data, or account details in issues, screenshots, or fixtures.

## Reporting a selector break

Include the date, signed-in or signed-out state, page (zero-state or conversation), viewport width, which anchors the popup reports as missing, and a minimal DOM snippet with personal text removed.

## Before opening a PR

```bash
npm run typecheck && npm test && npm run build
```

Commit the rebuilt `extension/` folder together with your source changes. Then load `extension/` in Chrome and run the manual checklist in `docs/DEVELOPMENT.md`.
