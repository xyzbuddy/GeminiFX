# GeminiFX

**Make Gemini feel like home. Change the UI, not the AI.**

GeminiFX is a free, open-source Chrome extension that gives [Google Gemini](https://gemini.google.com) a clean, ChatGPT-style look and feel. Gemini stays Gemini: same models, same answers, same account. Only the interface changes.

> **Unofficial project.** GeminiFX is independent and is not affiliated with, endorsed by, or sponsored by Google or OpenAI. "Gemini" and "ChatGPT" are trademarks of their respective owners.

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

## Install

GeminiFX isn't on the Chrome Web Store yet. Build it and load it yourself:

```bash
git clone https://github.com/xyzbuddy/GeminiFX.git
cd GeminiFX
npm install
npm run build
```

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the **`dist`** folder.
3. Open or refresh [gemini.google.com](https://gemini.google.com).

To update later: `git pull`, `npm run build`, then click ⟳ on the GeminiFX card and refresh Gemini.

Requires Node 20.11+ and Chrome 114+ (or another Chromium browser).

---

## Privacy

- No servers, no accounts, no analytics, no network requests.
- Your on/off and display settings are stored only in your browser (`chrome.storage.local`).
- Permissions: `storage`, and access to `https://gemini.google.com/*` only.

---

## Project status: v0.1.0, early

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
| `src/content/` | Content script, DOM adapter, observers |
| `src/themes/` | Design tokens, the ChatGPT-style theme, the Gemini bridge stylesheet |
| `src/popup/` | React popup |
| `src/settings/` | Typed settings, defaults, migration, storage |
| `tests/` | Vitest unit tests |
| `docs/` | Architecture, compatibility notes, design decisions |

```bash
npm test          # unit tests
npm run build     # type-check + build + verify the manifest → dist/
```

---

## Contributing

Issues and pull requests are welcome. Please read [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) first. Visual changes follow a screenshot-and-approval process ([docs/DESIGN_DECISIONS.md](docs/DESIGN_DECISIONS.md)). Never include private chats or account details in issues or screenshots.

More docs: [Architecture](docs/ARCHITECTURE.md) · [Development & testing](docs/DEVELOPMENT.md) · [Gemini compatibility](docs/COMPATIBILITY.md) · [Changelog](CHANGELOG.md) · [Original project brief](docs/spec/PROJECT_BRIEF.md)

## License

[MIT](LICENSE)
