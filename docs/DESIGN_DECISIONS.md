# Design decisions

The owner approves every significant visual decision (see `.claude/skills/geminifx-ui-approval/SKILL.md`).
Statuses: Approval `PENDING` / `APPROVED` / `REVISED`; Implementation `NOT STARTED` / `IN PROGRESS` / `COMPLETE`.

Store only the screenshot region needed for the design in `docs/references/`. Never commit private conversations or account details.

| # | Component | Reference | Approved requirements | Unknowns | Approval | Implementation |
|---|---|---|---|---|---|---|
| 1 | Overall shell (page background, sidebar/main split, content width) | Owner screenshots R1 + R2 (2026-11-13), see Proposal P1 | P1-A (black shell) | Hover/focus states (not in references) | APPROVED 2026-11-13 | COMPLETE (verified live, signed out; see Implementation notes) |
| 2 | Sidebar (`sidebar` anchor) | R1 (collapsed), R2 (expanded) | P1-B (native widths kept) | Signed-in conversation list | APPROVED 2026-11-13 | COMPLETE (desktop sidebar and mobile drawer) |
| 3 | Conversation area (`chatHistory`, `userQuery`, `modelResponse`) | R4 (dark conversation) | P1-E (green user bubble, plain responses) | Code blocks, tables, citations not yet seen live; message selectors verified | APPROVED 2026-11-13; column REVISED: keep Gemini's 708 px (owner, 2026-11-13) | COMPLETE |
| 4 | Composer (`composer`, `promptInput`) | R1, R2 (zero-state composer) | P1-C; Send button = white circle (owner, 2026-11-13) | Multi-line growth not checked | APPROVED 2026-11-13 | COMPLETE |
| 5 | Top bar (`topBar`) | none yet | none | Keep, restyle, or minimize | PENDING | NOT STARTED |
| 6 | Typography and tokens | R1, R2. Owner asked for ChatGPT's current font | P1-D (system font stack, icons excluded) | Exact font name not confirmed; browser zoom 100% confirmed | APPROVED 2026-11-13 | COMPLETE |
| 7 | Extension popup | none yet | Functional P0 controls only (enable/disable, reset, status) | Layout, colors, branding. Current styling is provisional and neutral | PENDING | IN PROGRESS (functional; visuals provisional) |
| 8 | Extension icon | none yet | Must be original: no Google, Gemini, OpenAI or ChatGPT marks | Shape, colors. Current icon is a provisional geometric placeholder (`scripts/generate-icons.mjs`) | PENDING | IN PROGRESS (provisional) |
| 9 | Light theme / presets (P1) | R3 (light zero-state, expanded sidebar) | P1-F; follows Gemini's own light/dark mode (owner, 2026-11-13) | none | APPROVED 2026-11-13 | COMPLETE |

---

## Proposal P1: ChatGPT-style black shell (2026-11-13), status APPROVED

**Approval (2026-11-13):** the owner answered "Yes, approve all" to the question "Do you approve proposal P1 (A–F), with the send button white and the theme following Gemini?". This covers P1-A to P1-F only. Menus, dialogs, popovers, the popup and the icon are NOT covered.

**References.** R1 = ChatGPT zero-state with the sidebar collapsed (1918×1024 screenshot). R2 = same page with the sidebar expanded (1917×1026). Both were supplied by the owner. They contain personal data (name, avatar, project names), so they are **not** stored in the repo; only the measurements below are recorded.

**Owner direction.** Black theme, simple interface, as close to ChatGPT's feel as possible; use ChatGPT's current font if possible.

**Measurement method.** Colors are sampled pixels. Sizes assume 150% Windows display scaling (image px ÷ 1.5); the 768 px composer and 52 px rail both fit that assumption. *Scaling not yet confirmed by the owner.*

### Visible facts

| Element | Measured (image px) | CSS estimate | Color |
|---|---|---|---|
| Page and main area background | flat | flat | `#000000` |
| Sidebar background (rail and expanded) | flat | flat | `#000000` |
| Sidebar right divider | 1 px | 1 px | `#0d0d0d` |
| Collapsed rail width | 78 | 52 px | |
| Expanded sidebar width | 426 | ≈284 px | |
| Active nav item ("New chat") | 54 tall, 6-9 px inset | 36 px tall, ≈6 px inset | `#1a1a1a` |
| Sidebar footer divider | 1 px | 1 px | `#0f0f0f` |
| Primary text (title, heading, icons) | | | `#ededed` |
| Nav item text | ≈20 px glyphs | ≈14 px | light grey (≈`#bebebe`–`#ededed`, anti-aliasing) |
| Section labels ("Projects", "Recents"), placeholder | | | `#afafaf` |
| Composer | 1152 × 78, pill | 768 × 52 px, fully rounded | bg `#1b1b1b`, 1 px border `#262626` |
| Zero-state heading | centred above composer | ≈28 px, regular weight | `#ededed` |
| Voice button | 54 px circle | 36 px | `#48a04c` |
| Footer pill button | | | bg `#212121`, border `#424242` |
| Font | Glyph shapes match Segoe UI (Windows system font) | system font stack | |

### Cannot be determined from R1/R2
Hover, focus and pressed states; animations; conversation/message view; narrow and mobile layout; light mode; scrollbar behavior; the exact font name (needs DevTools "Rendered Fonts" to confirm).

### Proposed implementation (CSS only, new file `src/themes/chatgpt-inspired-dark.css`)

- **P1-A Shell:** `#000` background on body/`appRoot`/`mainContent`/`chatWindow`, overriding Gemini's blue zero-state glow; text `#ededed`, muted `#afafaf`. The top-right cluster (`topBar`) keeps its native buttons, recoloured only.
- **P1-B Sidebar:** rail and panel `#000`, 1 px right divider `#0d0d0d`. **Keep Gemini's native widths (52 px / 288 px)**: ChatGPT's ≈284 px differs by 4 px, and changing Angular Material's drawer width risks layout bugs. Nav items: 36 px tall, ≈8 px radius, active/hover `#1a1a1a`, 14 px text. Gemini's logo and icons stay (ChatGPT/OpenAI logos must not be used).
- **P1-C Composer:** max width 768 px, min height 52 px, fully rounded, `#1b1b1b` with a 1 px `#262626` border, placeholder `#afafaf`, icons `#ededed`. Native Gemini buttons (+ Upload & tools, mode picker, Dictate, Send) are restyled in place, never replaced.
- **P1-D Font:** system stack `ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif` for text inside GeminiFX anchors. **Icon elements (`mat-icon`, `gem-icon`) are excluded**: Gemini's icons are a font, and overriding it would break every icon. Code keeps a monospace font. A popup font switch (ChatGPT-style / Gemini original) is P1 and would follow after P0.

Gemini's own texts ("Hi, I'm Gemini…", "Ask Gemini") are kept; GeminiFX does not rewrite page text.

### Open questions for the owner
1. Is Windows display scaling 150%? (Settings → System → Display → Scale)
2. Approve P1-A, P1-B, P1-C, P1-D (each or all)?
3. Gemini's Send button (appears while typing) isn't in R1/R2. Make it a white circle (ChatGPT style), green `#48a04c`, or leave native?

### Addendum (2026-11-13): references R3 and R4

R3 = ChatGPT light mode, zero state, sidebar expanded (1917×1027). R4 = ChatGPT dark conversation view (1918×1149); it also shows browser zoom at 100%. Neither image is stored in the repo (they contain personal data). Chrome's toolbar size in R4 is consistent with 150% Windows scaling, so the ÷1.5 conversion is kept.

#### R4: dark conversation, visible facts

| Element | Measured (image px) | CSS estimate | Color |
|---|---|---|---|
| Main, sidebar and header background | flat | flat | `#000000` |
| Message column | x 597-1748 | 768 px, centred | |
| Assistant message | no bubble, plain text | ≈16 px body | `#ededed` |
| User message bubble | 806 wide (2 lines), right-aligned | max ≈70% of column, ≈20 px radius | bg `#2c6732` (owner's ChatGPT green accent), text `#effaf3` |
| Inline code | | | bg `#1b1b1b`, text `#ededed`, monospace |
| Message action icons (copy, like, speak, share, more) | ≈24 px | ≈16 px | `#afafaf` |
| Header (conversation title, left of main) | | | `#ededed` on `#000` |
| Composer (bottom) | same pill as R1 | 768 × 52 px | bg `#1a1a1a`, border `#242424`-`#252525` |
| Active conversation in sidebar | inset 8 px, full row | | `#1a1a1a` |
| Sidebar section divider | 1 px | 1 px | `#131313` |

#### R3: light mode, visible facts

| Element | Color |
|---|---|
| Page, main and sidebar background | `#fcfcfc` |
| Sidebar divider, footer divider, active nav item | `#efefef` |
| Composer | `#ffffff`, 1 px border `#ececec`, soft drop shadow below (fades `#e9e9e9` → bg) |
| Heading and title text | `#0d0d0d` |
| Nav item text | ≈`#3c3c3c` (anti-aliasing; may be darker) |
| Section labels, placeholder | `#8f8f8f` |
| Footer pill button | bg `#ffffff`, border `#d9d9d9` |

#### P1-E: conversation (dark)
Message column max 768 px. Gemini user prompt (`userQuery`): right-aligned bubble, max 70% width, ≈20 px radius, green `#2c6732` with text `#effaf3`. Gemini response (`modelResponse`): no bubble, `#ededed`, system font. Inline code `#1b1b1b`. Response action icons `#afafaf`. Native response actions, citations and links stay functional. **Blocker:** Gemini's message selectors (`user-query`, `model-response`) are unverified, so they must be checked on a live conversation before implementing.

#### P1-F: light variant
Same layout as P1-A–E with R3 colors. Proposed trigger: follow Gemini's own light/dark mode, which Gemini exposes as `body.dark-theme`. The brief lists light themes as P1, so this ships after the dark P0 version unless the owner says otherwise.

#### Additional open questions
4. Approve P1-E (conversation) and P1-F (light variant)?
5. May the agent send one harmless test prompt (e.g. "Hello") in the signed-out Gemini tab to verify message selectors? Alternatively, the owner signs in there.
6. Light variant: follow Gemini's light/dark setting (recommended), or a manual choice in the popup?

## Implementation notes: P1 (2026-11-13)

Files: `src/themes/chatgpt-inspired-dark.css` (color tokens, dark and light), `src/themes/gemini-bridge.css` (maps Gemini onto tokens), `src/themes/tokens.css`, plus new adapter sub-anchors.

**Verified on live Gemini** (signed out, zero state, built `content.js` with a stubbed `chrome` API):

| Check | Result |
|---|---|
| Page, sidebar, scrim backgrounds | `#000` dark / `#fcfcfc` light |
| Blue zero-state glow | Hidden (opacity 0 on the decorative element only) |
| Heading | System font, 28 px, weight 400, `#ededed` / `#0d0d0d` |
| Composer | 768 × 52 px pill, `#1b1b1b`, 1 px `#262626` (light: white, `#ececec`, soft shadow) |
| Placeholder | `#afafaf` |
| Send button | White circle, black icon (light: inverse); still Gemini's native button |
| Nav items | 36 px, 8 px radius, hover `#1a1a1a`; current item ("New chat") highlighted at full opacity, still disabled as Gemini intends |
| Icons | Still render in Gemini's icon font (excluded from the font override) |
| Typing, Upload & tools menu, Settings menu | Work normally |
| Light/dark switch | Follows Gemini's mode live, no reload |
| Mobile 375 px | Drawer (`mat-sidenav`) styled the same; composer stays 64 px tall on mobile (Gemini's larger touch padding is kept on purpose) |
| Disable | Removes every attribute, token and style; native look returns |

**Deviations from the proposal (minor):**
- Light-mode Send button is a dark circle with a white icon. A white circle on a white composer would be invisible; this is the inverse of the approved white circle, as ChatGPT's light mode does.
- The Send button keeps Gemini's 32 px size (ChatGPT ≈36 px) to avoid altering the native control's layout.
- Mobile composer is 64 px (see above).

**Not covered by approval, left native:** menus/popovers (e.g. Upload & tools, Settings), the signed-out "Sign in" / "Get App" buttons, top-bar links (recolored only through inherited text color).

**P1-E** was completed later the same day; see "P1-E conversation: implemented" below.
### P1-E conversation: implemented (2026-11-13)

Verified on a signed-out conversation created with one owner-approved test prompt ("Hello! Please reply in one short sentence that mentions the inline code `print()`."):

| Check | Result |
|---|---|
| User bubble | `#2c6732`, text `#effaf3`, 20 px radius, 12/16 px padding, system font |
| Response text | `#ededed`, system font, no bubble |
| Inline code | `#1b1b1b` background, `#ededed` text, monospace stack |
| Response action icons | `#afafaf` |
| Disable / re-enable | Native bubble (`#141414`) returns; re-enable gives one stylesheet |

**Deviations, owner decision needed:**
- **Column width kept at Gemini's 708 px (proposal: 768 px).** Gemini hard-codes 708 px on `user-query`, every paragraph, and the response header/footer; there's no shared variable. Widening means overriding max-width across all response content (lists, tables, code blocks), a much broader change than proposed. Options: (a) keep 708 px (current); (b) widen to 768 px with broader overrides plus extra testing of rich responses.
- **Bubble max width is Gemini's 452 px (≈64% of the column; proposal ≈70%).** Reaching 70% means also widening Gemini's bubble container.
- Bubble padding 12/16 px comes from the R4 measurements (not listed in the P1-E text).

**Not verified:** code blocks, tables, lists, citations and images in responses; Gemini's edit-prompt mode; streaming appearance.
---

## Proposal P2: typography size match (2026-11-13), status APPROVED

**Approval (2026-11-13):** the owner answered "Yes, approve P2" to "Do you approve P2: response and bubble text at 16px, sidebar labels at 14px?". This covers P2-A, P2-B and P2-C only.

**References.** R5 = owner's real Chrome, signed in, GeminiFX loaded, prompt "write 50 words cat stroy". R6 = ChatGPT with the same prompt. Same 150% scaling. Not stored (personal data).

**Owner request:** "can the font be matched fully so it looks the same?"

**Finding.** The font family already matches: both render Segoe UI (identical glyph shapes). The remaining difference is **size and line spacing**:

| Text | GeminiFX now (R5) | ChatGPT (R6) | Evidence |
|---|---|---|---|
| Response body | 17 px, line-height 24 px | 16 px, line-height ≈26 px | Same bubble string is 267 vs 250 px wide (×1.068 = 17/16); x-height 13 vs 12; line pitch 36 vs 39 image px |
| User bubble text | 17 px | 16 px | same as above |
| Sidebar labels ("New chat", "Images", "Scheduled", chat titles) | ≈13 px | ≈14 px | label widths 58/78/86 vs 63/84/93 (×1.08) |
| Colors (bubble `#2c6732`, composer `#1b1b1b`/`#1a1a1a`, black bg) | match | | sampled |

**Proposed (CSS only):**
- P2-A: response paragraphs and list items 16 px / 26 px line-height (`modelResponse` scope).
- P2-B: user bubble text 16 px.
- P2-C: sidebar nav labels and conversation titles 14 px.

**Unknown / not proposed:** headings inside responses (R5 and R6 contain different headings), code blocks, tables.

**Also seen in R5 (needs owner input):** an empty highlighted row under "New chat" in the signed-in sidebar. The signed-in sidebar was never inspected, so the cause is unknown: possibly a Gemini element whose content GeminiFX's colors hide, or a loading placeholder. A screenshot of the same area with GeminiFX turned off would show what belongs there.

### P2: implemented (2026-11-13)

Gemini's sizes come from type-scale variables (`markdown p-*` and `body-l` = 17/24 px for responses and the bubble, `body-s` = 13 px for sidebar labels). `gemini-bridge.css` re-points them only inside the `modelResponse`, `userBubble` and `sidebar` anchors.

Verified live (signed-out conversation): response paragraph **16 px / 26 px**, bubble text **16 px** (line height 24 px kept), sidebar label **14 px**. Not changed (outside P2): response headings, the prompt box text (Gemini 17 px), and the zero-state heading.

The body size now comes from the existing `fontSize` setting (default 16). Settings schema v2 migrates the old saved defaults (`fontSize` 15 → 16, `contentWidth` 800 → 768) so existing installs pick up the approved values; values a user chose themselves are kept.

Sidebar scope note: `body-s` is overridden for the whole sidebar, so every small sidebar text (including signed-in conversation titles) becomes 14 px, matching ChatGPT's uniform 14 px sidebar. The signed-in list was not inspected directly.

### Decision: conversation column width (2026-11-13)

The owner chose **"Keep 708px"** over widening to 768 px. GeminiFX does not override Gemini's message column width. The composer keeps the approved P1-C width of 768 px.
