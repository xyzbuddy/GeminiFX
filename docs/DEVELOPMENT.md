# Development

Requirements: Node 20.11+ (tested with Node 24, npm 11) and Chrome 114+.

```bash
npm install
npm run typecheck   # browser code + Vite configs
npm test            # Vitest + jsdom
npm run build       # typecheck → vite build → content build → verify-build → dist/
npm run icons       # regenerate provisional icons in public/icons/
```

## Load in Chrome

1. `npm run build`
2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the **`dist/`** folder.
3. Open or refresh `https://gemini.google.com/`. Tabs opened before install need a refresh.
4. After rebuilding, click the reload icon on the GeminiFX card and refresh the Gemini tab.

## Debugging

- Content script: in the Gemini tab's DevTools console, pick the "GeminiFX" context from the context dropdown. Check `document.documentElement.dataset` and `document.querySelectorAll('[data-geminifx-anchor]')`.
- Service worker: the "service worker" link on the extension card.
- Popup: right-click the toolbar icon, then **Inspect popup**.

## Testing

| Layer | How | Covers |
|---|---|---|
| Unit | `npm test` | settings validation, migration, storage, theme tokens, UiEngine enable/disable, adapter on a mock of the real DOM, fallbacks, invalid selectors, observer debounce, route detection |
| Build | `npm run build` | type errors, manifest validity, every referenced file exists, permissions are minimal |
| Live DOM | manual or agent browser | selectors against the real site (see `COMPATIBILITY.md` for what has been verified and how) |
| Real extension | manual in Chrome | install, popup, toggle, persistence, native Gemini flows |

### Manual regression checklist (real Chrome, signed in)

- [ ] Extension loads with no errors on the card.
- [ ] Popup on Gemini shows "Active"; on another site shows "Inactive: this tab is not Gemini".
- [ ] Toggle off restores native look; toggle on reapplies, with no reload needed.
- [ ] Settings persist after closing and reopening Chrome.
- [ ] Submit a prompt; the response streams; stop works.
- [ ] New chat; open an existing conversation; popup still "Active".
- [ ] Attachments, mic, model picker, response actions, citations still work.
- [ ] No GeminiFX errors in the console.
