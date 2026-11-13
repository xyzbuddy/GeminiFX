# GeminiFX
### A ChatGPT-Inspired Interface for Google Gemini

**Change the UI, Not the AI.**

GeminiFX is an open-source Chrome Extension that transforms the visual interface of Google Gemini into a modern, ChatGPT-inspired experience while preserving Gemini's original AI capabilities and native functionality.

The goal is simple: provide a cleaner, more customizable and familiar interface without replacing Gemini's underlying AI system.

> **Important:** GeminiFX is an unofficial, community-built project. It is not affiliated with, endorsed by, or sponsored by Google or OpenAI.

---

# 1. Project Vision

GeminiFX aims to redesign the user experience of `gemini.google.com` through a browser extension.

The extension will modify the presentation layer while leaving Gemini's actual AI engine, conversations, and native functionality intact.

### Core principles

- Change the visual interface, not the AI.
- Preserve Gemini's native functionality.
- Follow a ChatGPT-inspired desktop design.
- Provide customizable themes and interface settings.
- Keep the extension lightweight and maintainable.
- Never make major UI design decisions without user approval.
- Use modular code to accommodate Gemini interface changes.

---

# 2. Visual Design Goals

The target experience is a polished, ChatGPT-inspired interface.

The design should cover:

- Sidebar positioning, navigation and conversation history.
- Main conversation area and message layout.
- Message typography and spacing.
- Prompt composer and attachment controls.
- Responsive layout.
- Dark and light themes.
- Buttons, icons, borders, shadows and rounded corners.
- Hover, focus, disabled and active states.
- Consistent spacing and visual hierarchy.

The objective is not to reproduce every detail blindly. The design should follow the user's supplied screenshots and explicitly approved visual references.

---

# 3. Technology Stack

| Technology | Purpose |
|---|---|
| TypeScript | Main application logic |
| React | Extension popup and settings interface |
| Vite | Development and build tooling |
| CSS / CSS Variables | Interface styling and theme system |
| Chrome Extension Manifest V3 | Browser extension architecture |
| Chrome Storage API | Local settings persistence |
| MutationObserver | Detect Gemini DOM changes |
| Git & GitHub | Version control and open-source collaboration |
| Playwright | Browser-based testing |

### Architecture

```text
                 GEMINIFX
                     |
          Chrome Extension (MV3)
                     |
          +----------+----------+
          |                     |
     Content Script        Popup / Settings
          |                     |
     Gemini Website        React + Vite
          |                     |
     UI Adapter            Theme Settings
          |
     UI Transformation
          |
   ChatGPT-Inspired Interface
          |
    Original Gemini AI
    and Native Features
```

**No backend or database is required.** User preferences should be stored locally in the browser.

---

# 4. Proposed Project Structure

Use a modular and maintainable structure. Adjust it only when there is a clear technical reason.

```text
GeminiFX/
│
├── public/
│   └── icons/
│
├── src/
│   ├── background/
│   │   └── service-worker.ts
│   │
│   ├── content/
│   │   ├── index.ts
│   │   ├── observer.ts
│   │   ├── compatibility/
│   │   │   └── gemini-adapter.ts
│   │   └── features/
│   │       ├── sidebar/
│   │       ├── chat/
│   │       ├── composer/
│   │       └── layout/
│   │
│   ├── popup/
│   │   ├── App.tsx
│   │   └── components/
│   │
│   ├── settings/
│   │   └── settings.ts
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── themes.css
│   │   └── geminifx.css
│   │
│   └── shared/
│       └── types.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DESIGN_DECISIONS.md
│   ├── DEVELOPMENT.md
│   └── TESTING.md
│
├── .claude/
│   └── skills/
│       └── geminifx-ui-approval/
│           └── SKILL.md
│
├── CLAUDE.md
├── manifest.json
├── package.json
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

This is a proposed structure, not a requirement to create empty files immediately. Create files as the implementation needs them.

---

# 5. Feature Priorities

Development must follow a milestone-based approach.

## P0 — Core functionality

- Manifest V3 extension setup.
- Gemini domain integration.
- Main UI transformation.
- Sidebar redesign.
- Chat area redesign.
- Prompt composer styling.
- Preserve native Gemini controls.
- Dynamic DOM compatibility.
- Basic dark and light theme.

## P1 — Customization

- Theme selection.
- Custom accent colors.
- Sidebar customization.
- Layout preferences.
- Typography settings.
- Local settings persistence.
- Responsive behavior.

## P2 — Advanced features

- Additional theme presets.
- Advanced appearance settings.
- Optional interface animations.
- Accessibility improvements.
- Performance optimization.
- More extensive browser compatibility testing.

Do not start P2 work while critical P0 functionality remains incomplete.

---

# 6. Gemini Compatibility and Safety Rules

GeminiFX must operate as a presentation-layer extension.

### Mandatory rules

1. Do not replace Gemini's AI engine.
2. Do not intercept or modify private AI APIs.
3. Do not manipulate internal React state.
4. Do not interfere with prompt submission or response generation.
5. Preserve native Gemini buttons, controls and interactions.
6. Avoid deleting original elements when CSS-based customization is sufficient.
7. Do not rely on undocumented selectors without validating them.
8. Handle dynamic DOM updates with MutationObserver.
9. Prevent duplicate initialization and repeated event listeners.
10. Provide graceful fallbacks when Gemini changes its DOM.

Build a modular Gemini compatibility adapter. Keep selectors and DOM-dependent logic isolated from styling and application settings.

If a Gemini update breaks an interface component, isolate and repair the affected adapter rather than rewriting unrelated modules.

---

# 7. Theme Engine

Use CSS variables as the foundation of the theme system.

Example:

```css
:root {
  --gfx-bg-primary: #ffffff;
  --gfx-bg-secondary: #f7f7f8;
  --gfx-text-primary: #202123;
  --gfx-text-secondary: #6b7280;
  --gfx-border: #e5e7eb;
  --gfx-radius: 12px;
  --gfx-sidebar-width: 260px;
}
```

Support:

- Light theme.
- Dark theme.
- Custom accent color.
- Consistent typography.
- Reusable spacing values.
- Component-level styling.

Theme changes must not break Gemini's native functionality.

---

# 8. Settings and Local Storage

Use Chrome's local storage API for user preferences.

Example settings structure:

```ts
interface GeminiFXSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  sidebarEnabled: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}
```

Store only settings that are actually needed.

Do not collect or store conversation contents, prompts, authentication information or unnecessary personal data.

---

# 9. Extension Popup

The popup should provide a clean settings interface.

Expected controls:

- Extension enable/disable.
- Theme selection.
- Accent color.
- Sidebar settings.
- Compact mode.
- Animation settings.
- Project information and version.

The popup must remain separate from the Gemini page's core AI functionality.

---

# 10. MANDATORY: Human-in-the-Loop Design Approval

**This is a non-negotiable project requirement.**

The AI coding agent must collaborate with the user before implementing important visual changes.

It must never invent a major interface design simply because a reference is missing.

## Required workflow

```text
        UI Component Needs Design
                   |
                   v
        Is Reference Available?
              /         \
            YES          NO
             |            |
             v            v
      Analyze Image    Ask User for
      and Layout       Screenshot
             |            |
             |            v
             |       Wait for Upload
             |            |
             +------------+
                   |
                   v
          Analyze Design Details
                   |
                   v
         Present Implementation Plan
                   |
                   v
           Request User Approval
                   |
             +-----+-----+
             |           |
           YES           NO
             |           |
             v           v
       Implement      Wait for
       Approved UI    Feedback
             |
             v
       Test the Result
             |
             v
       Report Completion
```

## Step 1 — Request screenshots

When a significant UI component needs a visual reference, ask the user to upload the relevant screenshot.

When useful, request both:

- The current Gemini interface screenshot.
- The desired ChatGPT or other reference interface screenshot.

Do not proceed with major visual implementation while the necessary reference is missing.

## Step 2 — Analyze the reference

Inspect the supplied screenshots carefully.

Analyze:

- Component position.
- Layout and alignment.
- Width and height.
- Padding and margins.
- Spacing and proportions.
- Background and foreground colors.
- Typography and font sizes.
- Borders and border radius.
- Icons and buttons.
- Hover and active states.
- Responsive behavior.

Distinguish clearly between visible facts and details that cannot be determined from a screenshot.

## Step 3 — Present a proposal

Before implementation, explain:

1. What component will be changed.
2. What visual properties will be changed.
3. How the existing Gemini functionality will be preserved.
4. What implementation approach will be used.
5. Any technical limitations or uncertainties.

## Step 4 — Wait for explicit approval

Do not write or modify important UI implementation code until the user explicitly approves the proposal.

Silence, an unrelated message or an ambiguous response is not approval.

If the user requests changes, revise the proposal and ask again.

## Step 5 — Implement and verify

After approval:

- Implement only the approved design.
- Preserve Gemini's native behavior.
- Compare the result with the supplied screenshot.
- Test relevant screen sizes and interaction states.
- Report any deviations or limitations.

If implementation requires a significant departure from the approved reference, stop and obtain approval again.

## Design decision tracking

Maintain:

`docs/DESIGN_DECISIONS.md`

For each significant UI component, record:

| Field | Description |
|---|---|
| Component | Component being redesigned |
| Reference | Screenshot or design reference |
| Requirements | Approved visual requirements |
| Unknowns | Unresolved design details |
| Approval | PENDING / APPROVED / REVISED |
| Implementation | NOT STARTED / IN PROGRESS / COMPLETE |

This prevents accidental design changes and preserves the user's decisions across development sessions.

---

# 11. Automatic Claude Skill Discovery and Activation

**The coding agent should automatically identify and use relevant available skills. The user should not need to manually name a skill every time.**

This requirement applies to Claude Code and other AI coding agents where an equivalent skill-discovery mechanism is available.

## 11.1 Initial project inspection

Before beginning implementation, the agent must inspect:

1. `README.md`
2. `CLAUDE.md`, if present.
3. Existing project structure.
4. Existing source code and configuration.
5. Available AI agent skills and their descriptions.
6. Existing design decisions and approval records.

Do not assume that a skill exists just because this README mentions it.

## 11.2 Automatic skill discovery

For Claude Code:

- Inspect the project's `.claude/skills/` directory.
- Inspect any globally available skills exposed by the environment.
- Read the skill descriptions and instructions.
- Select relevant skills based on the current task.
- Load and follow the full instructions of selected skills before implementation.

Skill discovery must be based on actual availability, not assumptions.

For other coding agents, use their documented skill discovery and activation mechanism where available.

If the agent cannot discover skills automatically, it must explain the limitation and continue only with the capabilities and instructions actually available.

## 11.3 Suggested skill categories

Select relevant skills according to the task:

| Task | Relevant skill category |
|---|---|
| React interface development | Frontend Design |
| UI layout and styling | UI / UX Design |
| Browser automation | Playwright / Webapp Testing |
| Debugging | Debugging and Troubleshooting |
| Code architecture | Software Engineering |
| Chrome extension development | Browser Extension Development |
| Documentation | Technical Writing |
| Accessibility | Accessibility Testing |

These are skill categories and suggested names, not guaranteed installed skills.

## 11.4 Project-specific custom skill

Create a project-specific skill:

`.claude/skills/geminifx-ui-approval/SKILL.md`

Its purpose is to enforce:

- Screenshot-first design decisions.
- Design analysis.
- Explicit user approval.
- Approved-reference consistency.
- Gemini functionality preservation.
- Design decision documentation.
- Testing and verification.

The skill should contain clear metadata and a description that makes it discoverable for GeminiFX UI and design-related tasks.

Example frontmatter:

```yaml
---
name: geminifx-ui-approval
description: Enforces screenshot-based UI design analysis, explicit user approval, and approved-reference consistency for all significant GeminiFX interface changes.
---
```

Do not create duplicate skills if an equivalent project skill already exists. Inspect and improve the existing one when appropriate.

## 11.5 Skill selection priority

Use this order:

1. GeminiFX project-specific rules and approval requirements.
2. Relevant available project skills.
3. Relevant globally available skills.
4. General coding-agent capabilities.

When multiple skills apply, use the smallest relevant combination rather than loading unrelated instructions.

If two skills conflict, follow the project-specific safety and approval requirements and explain any unresolved conflict.

## 11.6 Important platform limitation

A README alone cannot guarantee that every Claude product automatically activates every skill.

Claude Code uses its supported project and user skill discovery mechanisms. Claude.ai has its own Skills interface and availability rules.

Therefore:

- Keep project instructions in `CLAUDE.md`.
- Keep reusable project-specific skill instructions in `.claude/skills/`.
- Keep the skill-discovery policy in this README.
- Never claim that a skill is active unless the environment confirms it.

The objective is to minimize manual intervention while remaining honest about the agent's actual capabilities.

---

# 12. CLAUDE.md Project Instructions

Create a root-level `CLAUDE.md` containing concise project instructions.

It must tell Claude to:

1. Read the complete README before starting.
2. Inspect the existing codebase before proposing changes.
3. Discover and activate relevant available skills automatically.
4. Follow the GeminiFX project-specific skill.
5. Respect the screenshot approval workflow.
6. Never implement major UI changes without explicit approval.
7. Preserve Gemini's native functionality.
8. Update documentation when architecture or behavior changes.
9. Run relevant tests after implementation.
10. Summarize completed work and remaining limitations.

Do not duplicate the entire README inside `CLAUDE.md`. Reference the README as the main project specification.

---

# 13. Development Workflow

Follow this sequence for all development sessions.

### Phase 1 — Understand

- Read project documentation.
- Inspect the existing codebase.
- Discover available skills.
- Identify completed and incomplete features.
- Avoid overwriting working code unnecessarily.

### Phase 2 — Plan

- Identify the next development milestone.
- List affected components.
- Identify technical risks.
- Request missing design references.
- Present approval-required UI proposals.

### Phase 3 — Approve

- Wait for explicit approval of significant visual changes.
- Record approved decisions.
- Do not implement rejected or pending designs.

### Phase 4 — Implement

- Follow modular architecture.
- Reuse existing components where practical.
- Keep code maintainable.
- Preserve native Gemini functionality.
- Avoid unrelated modifications.

### Phase 5 — Test

- Build the extension.
- Test in Chrome.
- Inspect browser console errors.
- Verify native Gemini interactions.
- Verify theme persistence.
- Check dynamic DOM behavior.
- Compare approved visual references.

### Phase 6 — Document

- Update README when necessary.
- Update architecture and design decisions.
- Update changelog.
- Report tests and limitations.

---

# 14. Testing and Acceptance Criteria

A feature is not complete merely because its code has been written.

Verify:

- Extension installs successfully.
- Manifest V3 configuration is valid.
- Gemini loads normally.
- Gemini can receive and process prompts.
- Responses render normally.
- Native buttons and controls remain functional.
- Sidebar and composer match approved references.
- Theme settings work and persist.
- Dynamic DOM updates do not break the interface.
- No unnecessary network requests or data collection are introduced.
- No critical console errors remain.

Use automated tests where practical and manual browser verification for visual and native interaction behavior.

---

# 15. Open-Source Standards

GeminiFX is intended to be an open-source project.

Maintain:

- A clear README.
- A suitable open-source LICENSE.
- Contribution guidelines.
- Changelog.
- Issue and bug-report templates where appropriate.
- Screenshots of implemented and approved UI.
- Clear installation instructions.
- Honest documentation of known limitations.

Never claim that a feature works without testing it.

Do not include credentials, private tokens or personal data in the repository.

---

# 16. Local Installation

After implementation:

1. Install dependencies using the project's package manager.
2. Build the extension.
3. Open `chrome://extensions/`.
4. Enable Developer mode.
5. Select **Load unpacked**.
6. Choose the generated extension directory.
7. Open `https://gemini.google.com/`.
8. Verify the extension and native Gemini functionality.

The build output directory must be documented in the final project instructions.

---

# 17. Mandatory Instructions for AI Coding Agents

Any AI agent working on GeminiFX must follow these instructions.

**Before coding:**

- Understand the project.
- Read the README and agent instructions.
- Inspect the current implementation.
- Discover available relevant skills.
- Identify the next appropriate task.
- Ask for missing visual references.

**During coding:**

- Follow approved design decisions.
- Preserve Gemini functionality.
- Avoid unnecessary architectural changes.
- Keep the implementation modular.
- Do not fabricate selectors, test results or capabilities.
- Ask before making significant unapproved design changes.

**After coding:**

- Run relevant tests.
- Report modified files.
- Report successful and failed tests accurately.
- Document remaining limitations.
- Update relevant project documentation.

If the user has not approved a required UI design, do not implement that visual component. Continue only independent technical work that does not pre-empt the pending design decision.

---

# 18. First-Run Instructions for the AI Agent

When the user provides this repository to an AI coding agent, do not immediately start changing the UI.

Start by:

1. Reading this README and `CLAUDE.md`, if present.
2. Inspecting the current repository and determining its implementation status.
3. Automatically discovering relevant available skills.
4. Loading the relevant skill instructions.
5. Checking for the project-specific GeminiFX approval skill.
6. Creating or updating missing project documentation and agent instructions where appropriate.
7. Identifying the next milestone and preparing a development plan.
8. Asking the user for screenshots whenever significant visual references are missing.
9. Obtaining explicit approval before implementing those visual changes.
10. Beginning the approved implementation in small, verifiable milestones.

Do not restart an existing project unnecessarily. Preserve existing working code and continue from its actual state.

If essential tools, skills, permissions or references are unavailable, explain exactly what is missing and what can still be done.

---

# 19. Definition of Success

GeminiFX succeeds when:

- Gemini looks and feels like a polished, ChatGPT-inspired interface.
- Gemini's original AI and native functionality remain intact.
- Users can customize their interface.
- The extension is lightweight and maintainable.
- UI decisions follow screenshot-based approval.
- AI coding agents discover and use relevant available skills.
- The project can be developed collaboratively without losing the user's design vision.

---

# Final Project Principle

**Change the UI, Not the AI.**

**Ask First → Inspect References → Propose Design → Get Approval → Implement → Test → Document.**

GeminiFX is not just a visual redesign. It is a carefully engineered, user-controlled interface transformation for Google Gemini.