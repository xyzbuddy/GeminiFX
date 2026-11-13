# GeminiFX --- AI Development Brief & Project README

> **Tagline:** A Better Way to Experience Gemini\
> **Core principle:** Change the UI, not the AI.\
> **Project type:** Open-source Chromium browser extension\
> **Primary target:** `https://gemini.google.com/*`\
> **Initial release:** Complete ChatGPT-inspired UI redesign with a
> maintainable theme system

------------------------------------------------------------------------

## 1. What GeminiFX is

GeminiFX is an independent, open-source browser extension that
transforms the **visual interface** of Google Gemini into a polished
workspace inspired by the layout, spacing, hierarchy, and interaction
feel of ChatGPT.

The goal is to make Gemini feel familiar to people who are accustomed to
ChatGPT's interface. The redesigned experience should include a dark,
refined workspace; a left navigation sidebar; a centered conversation
area; a clean message composer; consistent typography; restrained
borders; and carefully designed hover, focus, and active states.

**Gemini remains the AI product.** GeminiFX must not replace, proxy,
intercept, or reimplement Gemini's AI services. It must preserve
Gemini's native sign-in, conversations, prompts, model controls,
response generation, streaming, attachments, and other native
functionality wherever possible.

The project is a visual customization layer only.

### Important product and branding boundaries

-   GeminiFX is an independent community project, not an official
    Google, Gemini, OpenAI, or ChatGPT product.
-   Do not use Google, Gemini, OpenAI, or ChatGPT logos as the
    extension's own logo.
-   Do not claim affiliation or endorsement.
-   Use ChatGPT as a **visual design reference**, not as a reason to
    copy proprietary logos, brand assets, or source code.
-   Include a clear third-party / unofficial-project disclaimer in the
    extension listing and documentation.

------------------------------------------------------------------------

## 2. Primary design objective

Create a cohesive Gemini interface that closely follows the **general
ChatGPT desktop design language** while remaining technically and
functionally native to Gemini.

### Desired visual direction

1.  **Overall shell**
    -   Deep charcoal / near-black application background.
    -   A distinct but subtle left sidebar.
    -   Main conversation area occupying the remaining width.
    -   Balanced maximum content width and generous whitespace.
    -   Consistent surface, border, and text colors.
2.  **Sidebar**
    -   Place the navigation sidebar on the left on desktop.
    -   Use a stable width, subtle divider, and consistent internal
        spacing.
    -   Preserve Gemini's existing navigation actions and conversation
        links.
    -   Do not remove, rename, or break native navigation controls.
    -   Make collapsed / expanded states look intentional.
    -   On narrow screens, preserve Gemini's native responsive
        navigation behavior where possible.
3.  **Conversation area**
    -   Clear visual separation between user prompts and Gemini
        responses.
    -   Comfortable reading width and line height.
    -   Consistent vertical rhythm between messages.
    -   Well-styled code blocks, inline code, tables, lists, and
        quotations.
    -   Preserve native response actions, citations, links, and
        interactive content.
4.  **Composer / prompt input**
    -   Create a visually refined, rounded composer surface.
    -   Preserve the original Gemini input element and its event
        behavior.
    -   Preserve send, attachment, microphone, model, and tool controls
        when present.
    -   Do not replace the native input with a decorative imitation.
    -   Maintain visible keyboard focus and accessible contrast.
5.  **Controls and interaction states**
    -   Consistent icon sizing and alignment.
    -   Subtle hover, focus, active, and disabled states.
    -   Avoid excessive gradients, glow, animation, or visual clutter.
    -   Respect `prefers-reduced-motion`.
6.  **Typography**
    -   Use a clean system-font stack by default.
    -   Keep headings, body text, metadata, and code visually distinct.
    -   Ensure long responses remain readable.

### Design fidelity

The goal is a highly convincing ChatGPT-inspired experience, not a claim
of guaranteed pixel-for-pixel reproduction. Match the reference's
overall visual hierarchy and interaction patterns while adapting to
Gemini's real DOM, controls, and responsive behavior.

------------------------------------------------------------------------

## 3. Required first-version features

### P0 --- Must work in the first usable release

-   [ ] Installable Chrome / Chromium extension using Manifest V3.
-   [ ] Automatic activation only on `gemini.google.com`.
-   [ ] Complete dark, ChatGPT-inspired interface transformation.
-   [ ] Left-side desktop navigation styling.
-   [ ] Redesigned conversation layout and message spacing.
-   [ ] Redesigned composer appearance without replacing native
    functionality.
-   [ ] Consistent typography, colors, borders, radii, and hover states.
-   [ ] Preserve native Gemini interactions.
-   [ ] Enable / disable GeminiFX.
-   [ ] Persist user settings locally.
-   [ ] Reset settings to defaults.
-   [ ] Handle dynamically rendered content and route changes.
-   [ ] No backend, account system, analytics service, or database.

### P1 --- Add after the core redesign is stable

-   [ ] Theme presets: OLED Black, Midnight, and Minimal Light.
-   [ ] Accent color selection.
-   [ ] Sidebar width and conversation width controls.
-   [ ] Font size and density controls.
-   [ ] Import / export settings as JSON.
-   [ ] A compact extension popup with theme selection and quick
    controls.

### P2 --- Future possibilities

-   [ ] Community theme sharing.
-   [ ] Optional custom CSS editor with validation and warnings.
-   [ ] Additional layout presets.
-   [ ] Compatibility diagnostics page.
-   [ ] More Chromium browser support and, separately, Firefox support
    if feasible.

Do not delay the first working release by implementing P1 or P2 features
prematurely. First make the P0 interface stable.

------------------------------------------------------------------------

## 4. Technology stack

Use the following stack unless a concrete compatibility issue justifies
a documented alternative.

  Area                   Technology
  ---------------------- -----------------------------------------
  Language               TypeScript
  Extension platform     Chrome Extensions Manifest V3
  UI for popup           React
  Build tool             Vite
  Styling                CSS, CSS variables
  Local preferences      `chrome.storage.local`
  DOM integration        Content scripts
  Dynamic DOM handling   `MutationObserver`, used selectively
  Version control        Git and GitHub
  Tests                  Vitest and suitable DOM / browser tests

### Runtime constraints

-   No backend.
-   No database.
-   No remote API required.
-   No user account or login for GeminiFX.
-   Do not collect or transmit browsing history, prompts, conversations,
    or personal data.
-   Keep all preferences local using `chrome.storage.local`.
-   Do not add unnecessary dependencies.

------------------------------------------------------------------------

## 5. Required project structure

Create a clean, modular repository with this structure. You may add
files when genuinely needed, but explain any significant structural
changes.

``` text
geminifx/
│
├── public/
│   ├── icons/
│   │   ├── icon-16.png
│   │   ├── icon-32.png
│   │   ├── icon-48.png
│   │   └── icon-128.png
│   └── manifest.json
│
├── src/
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   ├── index.ts
│   │   ├── observer.ts
│   │   ├── route-handler.ts
│   │   └── dom-adapter.ts
│   │
│   ├── core/
│   │   ├── theme-engine.ts
│   │   ├── ui-engine.ts
│   │   ├── compatibility.ts
│   │   ├── settings-manager.ts
│   │   └── constants.ts
│   │
│   ├── themes/
│   │   ├── tokens.css
│   │   ├── chatgpt-inspired-dark.css
│   │   ├── oled-black.css
│   │   ├── midnight.css
│   │   └── minimal-light.css
│   │
│   ├── popup/
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── components/
│   │       ├── ThemeSelector.tsx
│   │       ├── Toggle.tsx
│   │       └── SettingsPanel.tsx
│   │
│   ├── settings/
│   │   ├── schema.ts
│   │   ├── defaults.ts
│   │   └── storage.ts
│   │
│   ├── styles/
│   │   └── popup.css
│   │
│   └── types/
│       └── chrome.d.ts
│
├── tests/
│   ├── settings.test.ts
│   ├── theme-engine.test.ts
│   └── compatibility.test.ts
│
├── docs/
│   ├── DEVELOPMENT.md
│   ├── ARCHITECTURE.md
│   ├── COMPATIBILITY.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── README.md
├── LICENSE
└── CHANGELOG.md
```

### Structure notes

-   `content/` is responsible for safely applying the visual layer to
    Gemini.
-   `dom-adapter.ts` isolates Gemini-specific DOM selectors and element
    discovery.
-   `core/` contains reusable logic independent of individual theme
    styles.
-   `themes/` contains design tokens and theme-specific CSS.
-   `popup/` contains the extension's React settings interface.
-   `settings/` defines typed settings, defaults, validation, and
    storage.
-   `docs/` explains development, architecture, compatibility, and
    contribution.
-   The manifest must be valid for the chosen Vite build output. Do not
    assume that source paths and built paths are identical.

------------------------------------------------------------------------

## 6. Engineering requirements

### 6.1 Manifest V3

-   Use Manifest V3.
-   Limit host permissions to `https://gemini.google.com/*`.
-   Use the minimum permissions necessary.
-   Request `storage` only for local settings.
-   Do not request broad permissions such as all websites unless a
    documented feature genuinely requires them.
-   Do not use remotely hosted executable JavaScript or remote code.
-   Ensure the final manifest points to files that actually exist in the
    production build.

### 6.2 Safe DOM integration

Gemini is a dynamic web application. Its DOM can change without notice.

Implement a dedicated adapter that:

-   Locates the sidebar, main content area, composer, and relevant
    controls.
-   Uses resilient selectors where possible, preferring stable semantic
    attributes and accessible labels over generated class names.
-   Keeps Gemini-specific selectors in one place.
-   Supports selector fallbacks.
-   Detects when required elements are missing.
-   Avoids throwing errors when a selector stops matching.
-   Does not assume that a selector observed once will remain valid
    forever.

Do not invent Gemini selectors. Inspect the live page or supplied
screenshots / DOM snapshots. If the environment cannot access Gemini's
live DOM, clearly identify the missing evidence and build a selector
configuration that can be completed after local inspection. Do not claim
that unverified selectors have been tested.

### 6.3 Dynamic content and navigation

-   Gemini may render or replace elements after initial page load.
-   Use `MutationObserver` only where needed.
-   Debounce or batch expensive DOM work.
-   Avoid observing the entire document with a costly callback that
    repeatedly rewrites the page.
-   Handle client-side route changes.
-   Prevent duplicate style injection and duplicate event listeners.
-   Clean up observers and listeners when appropriate.
-   Ensure new conversations and newly rendered messages receive the
    intended styling.

### 6.4 Preserve native functionality

This is a strict requirement.

-   Do not intercept or rewrite prompt text.
-   Do not intercept network requests.
-   Do not call private Gemini APIs.
-   Do not manipulate internal React state.
-   Do not replace native buttons or inputs with fake controls.
-   Do not break send, stop, regenerate, attachment, microphone, model
    selection, conversation navigation, citations, or response actions.
-   Prefer CSS-only changes for existing controls.
-   If a custom control is introduced, it must invoke a supported native
    action safely and must not pretend to work when it does not.
-   If an element cannot be safely styled without breaking behavior,
    preserve its native implementation and document the limitation.

### 6.5 CSS isolation and maintainability

-   Prefix GeminiFX-owned classes with `geminifx-`.
-   Use CSS custom properties for colors, dimensions, spacing, and
    radii.
-   Avoid broad selectors that unintentionally style unrelated elements.
-   Do not globally hide unknown Gemini elements.
-   Avoid `!important` unless a documented, tested conflict requires it.
-   Keep theme styles separate from DOM discovery logic.
-   Make the extension easy to disable and restore to the native
    appearance.
-   Consider Shadow DOM for GeminiFX-owned UI such as a custom popup or
    injected settings panel. Do not move Gemini's native controls into
    Shadow DOM.

### 6.6 Accessibility and responsive behavior

-   Maintain readable text contrast.
-   Preserve keyboard navigation and visible focus indicators.
-   Respect reduced-motion preferences.
-   Avoid relying only on color to communicate state.
-   Test desktop and narrow viewport layouts.
-   Do not make the sidebar or composer unusable on smaller screens.

------------------------------------------------------------------------

## 7. Theme design system

Create shared CSS tokens. Example starting values are below; refine them
during implementation.

``` css
:root {
  --geminifx-bg: #212121;
  --geminifx-sidebar-bg: #171717;
  --geminifx-surface: #2a2a2a;
  --geminifx-surface-hover: #333333;
  --geminifx-border: rgba(255, 255, 255, 0.10);
  --geminifx-text: #ececec;
  --geminifx-text-muted: #a1a1aa;
  --geminifx-accent: #10a37f;

  --geminifx-sidebar-width: 260px;
  --geminifx-content-width: 800px;
  --geminifx-radius-sm: 8px;
  --geminifx-radius-md: 12px;
  --geminifx-radius-lg: 20px;

  --geminifx-font-size: 15px;
  --geminifx-line-height: 1.65;
}
```

These values are initial design tokens, not guaranteed Gemini selectors
or a final visual specification.

### Default theme

The first-run theme should be a refined ChatGPT-inspired dark theme.

### Theme switching

Theme switching must update tokens / classes without reloading Gemini or
resetting the current conversation.

Store a validated theme identifier, not arbitrary executable code.

------------------------------------------------------------------------

## 8. Settings model

Define a typed settings schema with sensible defaults.

Example:

``` ts
export type ThemeId =
  | "chatgpt-inspired-dark"
  | "oled-black"
  | "midnight"
  | "minimal-light";

export interface GeminiFXSettings {
  enabled: boolean;
  theme: ThemeId;
  accentColor: string;
  sidebarWidth: number;
  contentWidth: number;
  fontSize: number;
  compactMode: boolean;
}

export const defaultSettings: GeminiFXSettings = {
  enabled: true,
  theme: "chatgpt-inspired-dark",
  accentColor: "#10a37f",
  sidebarWidth: 260,
  contentWidth: 800,
  fontSize: 15,
  compactMode: false
};
```

Validate imported settings before saving or applying them. Handle
missing, malformed, or older settings gracefully. Include a settings
schema version so future migrations are possible.

------------------------------------------------------------------------

## 9. Extension popup requirements

Build a polished, compact React popup.

It should include:

-   GeminiFX name and original project icon.
-   Main enable / disable switch.
-   Current theme selector.
-   Quick access to layout settings.
-   A reset-to-default action.
-   A small status indicator showing whether the extension is active on
    Gemini.

The popup should not claim that GeminiFX is active on unrelated
websites. If the active tab is not Gemini, show a clear inactive / open
Gemini message.

Keep the popup lightweight. A full options page can be added later if
needed.

------------------------------------------------------------------------

## 10. Testing and acceptance criteria

Do not mark the project complete just because it compiles.

### Build and installation

-   [ ] `npm install` completes successfully.
-   [ ] `npm run build` completes successfully.
-   [ ] Production output contains a valid Manifest V3 manifest.
-   [ ] Every manifest-referenced file exists in the built output.
-   [ ] The unpacked extension can be loaded in Chrome.
-   [ ] No fatal errors appear in the extension service worker or
    content script.

### Visual behavior

-   [ ] Gemini's desktop page receives the intended dark visual
    transformation.
-   [ ] The sidebar appears and behaves correctly.
-   [ ] Conversation content remains readable.
-   [ ] The composer looks redesigned but remains native and functional.
-   [ ] Code blocks, tables, lists, links, and citations remain usable.
-   [ ] Hover, focus, and active states are coherent.
-   [ ] Narrow layouts remain usable.

### Functional regression

-   [ ] A user can submit a prompt.
-   [ ] Gemini can stream a response.
-   [ ] A new conversation can be started.
-   [ ] Existing conversations can be opened.
-   [ ] Native response actions remain usable.
-   [ ] Attachments and other available composer controls are not
    broken.
-   [ ] Disabling GeminiFX restores the native visual appearance.
-   [ ] Changing themes does not reset the current conversation.
-   [ ] Settings persist after browser restart.
-   [ ] Missing DOM elements do not crash the extension.

### Honest verification

Test against the real Gemini website in a browser whenever the
development environment permits. Separate these statuses in the final
report:

1.  Implemented.
2.  Build verified.
3.  Tested in a real browser.
4.  Not tested / requires local verification.

Never claim real-site compatibility if only a mock page or static
screenshot was tested.

------------------------------------------------------------------------

## 11. Development workflow

Work in small, verifiable milestones.

### Milestone 1 --- Inspect and plan

1.  Inspect the repository and available tooling.
2.  Inspect Gemini's actual page structure if browser access is
    available.
3.  Identify stable DOM anchors and native controls.
4.  Document uncertain selectors and responsive behavior.
5.  Establish the design tokens and visual layout plan.

### Milestone 2 --- Build the extension foundation

1.  Create the Vite + React + TypeScript project.
2.  Configure Manifest V3 and the production build.
3.  Implement the content script entry point.
4.  Implement local settings and defaults.
5.  Confirm the unpacked extension loads.

### Milestone 3 --- Implement the visual transformation

1.  Implement the DOM adapter.
2.  Apply the global theme tokens.
3.  Redesign the sidebar.
4.  Redesign the conversation area.
5.  Redesign the composer appearance without replacing its native
    behavior.
6.  Style message content and native controls.
7.  Test navigation and dynamic rendering.

### Milestone 4 --- Implement controls and persistence

1.  Build the React popup.
2.  Add enable / disable.
3.  Add theme selection.
4.  Persist settings.
5.  Add reset-to-default.
6.  Verify that changes apply without a page reload where practical.

### Milestone 5 --- Stabilize and document

1.  Run type checks and tests.
2.  Run the production build.
3.  Load and test the extension in Chrome.
4.  Fix functional regressions.
5.  Document known limitations.
6.  Prepare screenshots and release notes.
7.  Prepare the GitHub release.

At the end of each milestone, report changed files, commands run, test
results, and remaining issues.

------------------------------------------------------------------------

## 12. Instructions for the AI coding agent

**The following section is the implementation task. Treat it as the
project specification.**

You are the senior frontend and browser-extension engineer responsible
for implementing GeminiFX in the current workspace.

### Your mission

Build a complete, installable, open-source Chrome Extension that
transforms the visual interface of `gemini.google.com` into a polished
ChatGPT-inspired workspace while preserving Gemini's native AI
functionality.

### Mandatory execution rules

1.  **Inspect before editing.** Check the existing repository, package
    manager, files, and available browser / screenshot / DOM inspection
    tools. Do not overwrite an existing project blindly.
2.  **Implement the actual project.** Do not stop after writing a plan,
    pseudocode, sample snippets, or a folder tree.
3.  **Create every required file.** Include the manifest, build
    configuration, TypeScript source, React popup, CSS themes, settings,
    tests, documentation, and license.
4.  **Use real, verified selectors.** Inspect Gemini's live DOM when
    possible. Never invent selectors and describe them as verified. If
    live inspection is unavailable, isolate tentative selectors in the
    adapter, document the limitation, and make the rest of the project
    buildable.
5.  **Preserve native behavior.** Do not replace Gemini's composer or
    native controls with nonfunctional visual replicas. Do not intercept
    prompts, network calls, or private APIs.
6.  **Build and verify.** Install dependencies, run type checking, run
    tests, and create a production build. Fix errors rather than merely
    reporting them.
7.  **Check manifest output.** Verify the built manifest references real
    output files and the extension can be loaded as an unpacked
    extension.
8.  **Do not fake testing.** Clearly distinguish build checks, automated
    tests, mock-page tests, and real Gemini browser tests.
9.  **No backend.** Do not introduce a server, database, remote API,
    account system, telemetry, or analytics.
10. **Keep permissions minimal.** Use only the permissions required for
    the documented features.
11. **Make the project maintainable.** Keep selectors centralized, theme
    tokens separate, settings typed, and DOM observers controlled.
12. **Finish the usable P0 release first.** Do not spend time on
    marketplace features or advanced customization before the core
    transformation works.
13. **Do not leave placeholder functionality.** A visible control must
    work. If a feature cannot be implemented safely, omit it from the UI
    and document why.
14. **Do not stop at a successful compilation.** Verify that the built
    extension has the correct files and explain what still needs
    real-browser testing.

### Required final deliverables

At completion, provide:

-   The complete source code in the workspace.
-   A valid production build.
-   The exact build output folder to load through `chrome://extensions`
    → Developer mode → Load unpacked.
-   Installation instructions.
-   A summary of implemented features.
-   A list of files created or changed.
-   Build, type-check, and test results.
-   Real-browser verification status.
-   Known Gemini DOM / compatibility limitations.
-   Clear next steps for a human tester.

### Definition of done

GeminiFX is ready for its first local test when the production extension
builds, Chrome can load the unpacked build, the extension activates only
on Gemini, the visual layer applies without replacing native Gemini
controls, local settings work, and the implementation's unverified
compatibility points are clearly documented.

**Begin by inspecting the current workspace and available browser
inspection capabilities. Then implement the project end-to-end,
verifying each milestone. Do not respond with another high-level plan
instead of doing the work.**

------------------------------------------------------------------------

## 13. Local installation

After the AI coding agent has implemented the project:

1.  Open a terminal in the `geminifx` project folder.

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Build the extension:

    ``` bash
    npm run build
    ```

4.  Open Chrome and visit:

    ``` text
    chrome://extensions
    ```

5.  Enable **Developer mode**.

6.  Click **Load unpacked**.

7.  Select the actual production output folder reported by the build
    configuration (commonly `dist/`).

8.  Open or refresh `https://gemini.google.com/`.

9.  Confirm that GeminiFX activates and test the native conversation
    workflow.

If the extension does not load, inspect the Chrome extension error
details and the build output before changing the manifest paths.

------------------------------------------------------------------------

## 14. Open-source contribution principles

-   Keep contributions focused and reviewable.
-   Explain the Gemini UI version / page state used when reporting
    selector issues.
-   Include before-and-after screenshots for visual changes where
    possible.
-   Never include private conversations, personal data, or account
    details in issue reports.
-   Test that native Gemini controls remain functional.
-   Document new permissions and dependencies.
-   Keep the project independent and clearly unofficial.

------------------------------------------------------------------------

## 15. Project summary

**GeminiFX is a local-first, open-source visual redesign layer for
Gemini.** It aims to deliver a familiar ChatGPT-inspired interface while
leaving Gemini's underlying AI experience intact.

The first release prioritizes a complete dark UI transformation, a
left-side desktop navigation layout, a redesigned conversation
workspace, and a functional native composer. The codebase must be
modular so that future Gemini UI changes can be handled through a
focused compatibility layer rather than a complete rewrite.

**Change the UI, not the AI.**


---

## 16. Mandatory human-in-the-loop design approval protocol

**This protocol is mandatory. Do not bypass it for speed or convenience.**

The project owner wants direct control over visual design decisions. The AI coding agent must not independently invent, finalize, or implement a substantial UI design when the intended appearance has not been specified or approved.

The agent is responsible for engineering and implementation. The project owner is the authority on the desired visual result.

### 16.1 When to stop and request a reference

Before implementing or significantly changing any visually important area, check whether the owner has supplied an approved reference screenshot or sufficiently precise design instructions for that exact area.

Examples include:

- Overall Gemini page layout.
- Sidebar structure, position, width, and navigation appearance.
- Main conversation area and message layout.
- User prompt and Gemini response styling.
- Prompt composer and its controls.
- Header, toolbar, menus, dialogs, and popovers.
- Theme colors, typography, spacing, icons, and interaction states.
- Responsive or mobile layouts.
- Any new visual component not already approved.

If the reference or requirements are missing, **pause implementation of that area and ask the owner for the required screenshot or design direction.**

Do not silently choose a design, use a generic template, approximate from memory, or treat the phrase “ChatGPT-inspired” as approval for every detailed design decision.

### 16.2 Screenshot request workflow

When a design reference is needed:

1. Explain briefly which exact UI area needs a design decision.
2. Ask the owner to upload a screenshot of the target appearance.
3. If useful, ask for both:
   - A screenshot of the current Gemini area that will be changed.
   - A screenshot of the desired reference appearance.
4. Tell the owner they may annotate, crop, or mark the screenshot to identify the exact region.
5. Do not implement that design area while waiting for the reference.
6. Continue only with independent engineering tasks that do not prejudge the pending design.

Example message:

> I am ready to design the Gemini sidebar, but I do not yet have an approved visual reference for its exact layout. Please upload a screenshot showing how you want the sidebar to look. If possible, include the relevant ChatGPT reference and the current Gemini sidebar. I will inspect the screenshots and propose the implementation before changing the UI.

### 16.3 Inspect, summarize, and confirm before coding

After the owner provides a screenshot:

1. Inspect the screenshot carefully.
2. Identify the relevant layout, alignment, dimensions, spacing, colors, typography, borders, radii, icons, and visible states.
3. Separate clearly visible facts from details that cannot be determined from the screenshot.
4. Summarize the intended implementation in concise, concrete terms.
5. Identify any important ambiguity and ask only the necessary follow-up question.
6. Present the proposed changes and wait for explicit approval.
7. Implement only the approved design.

A screenshot is a visual reference, not permission to modify every part of the application. Follow the region and scope the owner identifies.

### 16.4 No-approval, no-design-implementation rule

Until explicit approval is received:

- Do not write or modify production CSS for the unapproved visual area.
- Do not implement a guessed layout or visual component.
- Do not replace the missing reference with an AI-generated mockup and treat it as approved.
- Do not claim that a design has been finalized.
- Do not interpret silence, “okay” unrelated to the proposal, or a request to continue other work as approval.
- Do not expand approval for one component to other components.

You may still perform non-visual groundwork that does not lock in the design, such as repository inspection, build configuration, typed settings infrastructure, test setup, documentation, and safe DOM research. Clearly label any provisional code and avoid shipping unapproved visual defaults as the finished design.

### 16.5 Approval record

For each major UI area, maintain a short design decision record in `docs/DESIGN_DECISIONS.md` containing:

- Component or page area.
- Reference screenshot filename or owner-provided description.
- Owner-approved requirements.
- Important measurements or visual observations, if known.
- Unresolved questions.
- Approval status: `PENDING`, `APPROVED`, or `REVISED`.
- Implementation status.

Do not store private conversations, account information, or sensitive content in these records. Use only the screenshot region necessary for the design.

### 16.6 Changes after implementation

If implementation reveals that the approved screenshot cannot be matched safely because of Gemini's native DOM or responsive behavior:

1. Stop before making a materially different design choice.
2. Explain the technical limitation.
3. Show or describe the available alternatives.
4. Ask the owner which alternative they approve.
5. Continue after receiving the decision.

If the owner later supplies a replacement screenshot or requests a revision, treat the new direction as the latest design reference for the specified area.

### 16.7 Priority order

When instructions conflict, follow this order:

1. Preserve Gemini's native functionality and user data.
2. Follow the owner's latest explicit design instruction and approved screenshot.
3. Follow the project-wide visual direction in this README.
4. Use conservative implementation defaults only for minor details that do not materially change the approved design.

**The key rule: ask first, inspect the reference, propose the design, receive approval, and only then implement. Never guess a major UI design on the owner's behalf.**
