# GeminiFX

**Make Gemini feel like home. Change the UI, not the AI.**

GeminiFX is a free, open-source Chrome extension that gives [Google Gemini](https://gemini.google.com) a clean, ChatGPT-style look and feel. Gemini stays Gemini: same models, same answers, same account. Only the interface changes.

> **Unofficial project.** GeminiFX is independent and is not affiliated with, endorsed by, or sponsored by Google or OpenAI. "Gemini" and "ChatGPT" are trademarks of their respective owners.

## ⚡ Quick install (2 minutes, no coding)

| Step | What to do |
|---|---|
| 1. Download | **[⬇ GeminiFX-extension.zip](https://github.com/xyzbuddy/GeminiFX/releases/latest/download/GeminiFX-extension.zip)** (always the latest version) |
| 2. Extract | Right-click the zip → **Extract All**. You get a folder with `manifest.json` inside. Keep this folder. |
| 3. Load | Open `chrome://extensions` → turn on **Developer mode** (top right) → **Load unpacked** → select **that folder** |
| 4. Use | Open or refresh [gemini.google.com](https://gemini.google.com) |

> ⚠️ **Don't download "Source code (zip)"** from the release page. That is the developer source, and Chrome will show *"Manifest file is missing"*.
> Already downloaded the whole repo (Code → Download ZIP)? That works too: select the **`extension`** folder inside it.

**Update:** download the zip again, replace the old folder's files, then click ⟳ on the GeminiFX card in `chrome://extensions`.

**"Manifest file is missing or unreadable"?** You selected the wrong folder. Select the folder that has `manifest.json` *directly* inside it.

---

## Why GeminiFX?

For about a year, many of us used ChatGPT's paid **Go** plan for free through a student or enterprise offer. Over that year it became our daily tool, and we got used to its interface: where things are, how a chat looks, how it feels to type.

Now that offer has ended. Gemini offers a similar student plan, so switching makes sense. But after a year in ChatGPT, Gemini's interface feels unfamiliar, and that gets in the way of actually working.

**GeminiFX bridges that gap.** You keep using Gemini, and it looks and feels like the ChatGPT environment you're used to.

---

## What it changes

| Area | With GeminiFX |
|---|---|
| Overall look | Pure black background; Gemini's blue glow removed |
| Sidebar | Black, a subtle divider, compact 36 px items, a soft highlight for the current page |
| Prompt box | Rounded 768 px pill, dark surface, thin border, white send button |
| Chat | Your messages in a green bubble; Gemini's replies as clean text without a bubble |
| Font | System font (Segoe UI on Windows); ChatGPT-like sizes: 16 px chat text, 14 px sidebar |
| Light mode | Automatically follows Gemini's own light/dark setting |
| Mobile width | The phone-size menu drawer gets the same style |

## What it does **not** change

- No new AI and no proxy: Gemini's models and answers are untouched.
- No reading, saving or sending of your prompts or chats.
- Every Gemini button still works (send, upload, microphone, model picker, menus), only restyled.
- Turn it off in the popup and Gemini looks exactly as before, without a reload.

---

## Install details

GeminiFX isn't on the Chrome Web Store yet. Use the **Quick install** above, or one of these:

- **With git (easy updates):** `git clone https://github.com/xyzbuddy/GeminiFX.git`, then **Load unpacked** the `GeminiFX/extension` folder. To update: `git pull`, then click ⟳ on the GeminiFX card.
- **Build from source (developers):** `npm install` then `npm run build`, which rebuilds the `extension/` folder.

Works in Chrome 114+ and other Chromium browsers (Edge, Brave). A school or work-managed Chrome may block Developer mode; that's a browser policy, not a GeminiFX error.

---

## Privacy

- No servers, no accounts, no analytics, no network requests.
- Your on/off and display settings are stored only in your browser (`chrome.storage.local`).
- Permissions: `storage`, and access to `https://gemini.google.com/*` only.

---

## Project status: v0.1.1

| Part | State |
|---|---|
| ChatGPT-style dark theme (shell, sidebar, prompt box, chat, font sizes) | Done, checked on live Gemini |
| Light variant | Done |
| Popup (on/off, reset, status) | Works; design is temporary |
| Extension icon | Temporary |
| Theme presets, accent colour, font choice | Planned |

**Known limitations**
- Gemini can change its page structure at any time. When it does, some styling may stop applying until GeminiFX is updated. Gemini keeps working either way, and the popup shows which parts weren't found.
- Not yet checked: code blocks, tables and images inside answers, and Gemini's edit-message mode.

---

## How it works (short)

A content script finds Gemini's main regions (sidebar, chat, prompt box) and marks them with its own `data-geminifx-anchor` attributes. One stylesheet then restyles those marked regions using CSS variables. Nothing is replaced or removed, so Gemini's own code keeps working.

All Gemini-specific selectors live in one file ([`src/content/dom-adapter.ts`](src/content/dom-adapter.ts)), so a Gemini update usually means fixing one list.

| Folder | What's inside |
|---|---|
| `extension/` | **Ready-to-load extension** (build output, committed) |
| `src/content/` | Content script, DOM adapter, observers |
| `src/themes/` | Design tokens, the ChatGPT-style theme, the Gemini bridge stylesheet |
| `src/popup/` | React popup |
| `src/settings/` | Typed settings, defaults, migration, storage |
| `tests/` | Vitest unit tests |
| `docs/` | Architecture, compatibility notes, design decisions |

```bash
npm test          # unit tests
npm run build     # type-check + build + verify the manifest → extension/
```

---

## Contributing

Issues and pull requests are welcome. Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) first. Visual changes follow a screenshot-and-approval process ([docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)). Never include private chats or account details in issues or screenshots.

More docs: [Architecture](docs/ARCHITECTURE.md) · [Development & testing](docs/DEVELOPMENT.md) · [Gemini compatibility](docs/COMPATIBILITY.md) · [Changelog](CHANGELOG.md) · [Original project brief](docs/spec/PROJECT_BRIEF.md)

## License

[MIT](LICENSE)
