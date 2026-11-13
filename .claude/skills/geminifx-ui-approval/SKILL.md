---
name: geminifx-ui-approval
description: Enforces screenshot-based UI design analysis, explicit owner approval, and approved-reference consistency for all significant GeminiFX interface changes. Use before writing or changing any GeminiFX CSS, theme, layout, popup design, icon, or other visual component, and whenever the owner shares a design screenshot.
---

# GeminiFX UI approval workflow

The project owner decides what GeminiFX looks like. You engineer it. Never invent, finalize or ship a significant visual design on the owner's behalf.

## 0. Check the record

Open `docs/DESIGN_DECISIONS.md`. Find the component you are about to touch.

- `APPROVED`: implement exactly the approved requirements. Anything beyond them needs a new approval.
- `PENDING`, `REVISED`, or missing: go to step 1. Do not write production CSS for it.

Significant areas include: overall shell, sidebar, conversation and messages, composer, header/top bar, menus, dialogs, popovers, theme colors, typography, spacing, icons, interaction states, responsive/mobile layout, the popup, the extension icon, and any new visual component.

## 1. Request a reference

Say which exact area needs a decision. Ask the owner to upload:

- a screenshot of the desired look (ChatGPT or other reference), and
- when useful, a screenshot of the current Gemini area.

Tell them they may crop, annotate or circle regions. Remind them to crop out private conversation text or account details. While waiting, continue only with work that doesn't lock in the design (adapter selectors, settings, tests, docs).

## 2. Analyze the screenshot

Report, separating **visible facts** from **cannot be determined from the image**:

- position, layout, alignment
- width/height, padding, margins, spacing, proportions
- background and foreground colors (estimated hex), borders, radii, shadows
- typography: family class, sizes, weights, line height
- icons and buttons
- hover/active/focus/disabled states (usually NOT visible: say so)
- responsive behavior (usually NOT visible: say so)

## 3. Propose

Write a short proposal covering:

1. Component(s) that will change, mapped to adapter anchors (`data-geminifx-anchor` keys).
2. Visual properties that will change, with concrete values.
3. How native Gemini functionality is preserved (CSS-only on anchors; no replaced controls).
4. Implementation approach (which CSS file, which tokens).
5. Limitations, uncertainties, and the specific questions you need answered.

Record it in `docs/DESIGN_DECISIONS.md` with status `PENDING`.

## 4. Wait for explicit approval

Approval is an unambiguous yes to *this* proposal. Not approval: silence, "continue", "ok" to something else, approval of a different component. If the owner asks for changes, revise, mark `REVISED`, and ask again.

## 5. Implement and verify

- Implement only what was approved. Rules target `[data-geminifx-anchor="..."]` under `html[data-geminifx="on"]`, using `--geminifx-*` tokens.
- Avoid `!important` unless a documented, tested conflict requires it. No broad selectors. Never hide unknown Gemini elements.
- Respect `prefers-reduced-motion` and keep visible focus.
- Build, load in Chrome, compare against the reference at desktop and narrow widths, check hover/focus states, and confirm native controls still work (send, stop, attachments, mic, model picker, sidebar navigation).
- If matching the reference would need a materially different approach, stop, explain the alternatives, and ask.

## 6. Record

Update the component's entry in `docs/DESIGN_DECISIONS.md` (approval and implementation status, deviations) and `CHANGELOG.md`.
