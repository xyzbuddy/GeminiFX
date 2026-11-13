import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ANCHOR_ATTR } from "../src/core/constants";
import { evaluateCompatibility } from "../src/core/compatibility";
import {
  ANCHORS,
  detectColorScheme,
  scanAnchors,
  tagAnchors,
  untagAll,
  type AnchorDefinition,
} from "../src/content/dom-adapter";
import { createDomObserver } from "../src/content/observer";
import { createRouteWatcher } from "../src/content/route-handler";

/**
 * Fixture mirrors the structure observed on the live signed-out Gemini page
 * (2026-11-13), trimmed to the anchor elements. It is a MOCK, not the real site.
 */
const GEMINI_FIXTURE = `
  <chat-app-orchestrator id="app-root">
    <chat-app data-test-id="chat-app">
      <main class="chat-app">
        <side-navigation-v2>
          <bard-sidenav-container>
            <bard-sidenav><side-navigation-content>
              <gem-nav-list-item data-test-id="reset-button"><a class="mat-mdc-list-item gem-nav-list-item mdc-list-item--disabled" aria-label="New chat" href="/app">New chat</a></gem-nav-list-item>
              <gem-nav-list-item data-test-id="images-side-nav-entry-button"><a class="mat-mdc-list-item gem-nav-list-item" href="/images">Images</a></gem-nav-list-item>
            </side-navigation-content></bard-sidenav>
            <bard-sidenav-content>
              <div><div id="xap-skip-link-target"><div>
                <chat-window>
                  <div class="lm-glow"></div>
                  <div class="zero-state-block-container"><assistant-messages-primary><h1 class="gds-display-m">Hi, I'm Gemini.</h1></assistant-messages-primary></div>
                  <div><chat-window-content>
                    <div id="chat-history"><infinite-scroller data-test-id="chat-history-container"><div class="conversation-container">
                      <user-query><span class="user-query-bubble-with-background"><div class="query-text">Hello</div></span></user-query>
                      <model-response><message-content><p>Use <code>print()</code>.</p><pre><code>print(1)</code></pre></message-content>
                        <message-actions><button aria-label="Copy"></button></message-actions></model-response>
                    </div></infinite-scroller></div>
                  </chat-window-content></div>
                  <input-container><div class="input-area-container is-zero-state"><input-area-v2><div><fieldset><div class="text-input-field">
                    <rich-textarea><div class="ql-editor" contenteditable="true" role="textbox" aria-label="Enter a prompt for Gemini"></div></rich-textarea>
                    <button aria-label="Upload &amp; tools"></button>
                    <gem-icon-button class="send-button"><button aria-label="Send message"></button></gem-icon-button>
                  </div></fieldset></div></input-area-v2></div></input-container>
                </chat-window>
              </div></div></div>
            </bard-sidenav-content>
          </bard-sidenav-container>
        </side-navigation-v2>
        <top-bar-actions></top-bar-actions>
      </main>
    </chat-app>
  </chat-app-orchestrator>`;

beforeEach(() => {
  document.body.innerHTML = GEMINI_FIXTURE;
});

afterEach(() => {
  document.body.innerHTML = "";
});

describe("dom adapter", () => {
  it("finds every required anchor on the fixture", () => {
    const report = evaluateCompatibility(scanAnchors(document));
    expect(report.missingRequired).toEqual([]);
    expect(report.level).toBe("ok");
  });

  it("scan does not modify the page", () => {
    const before = document.body.innerHTML;
    scanAnchors(document);
    expect(document.body.innerHTML).toBe(before);
  });

  it("tags anchors with GeminiFX-owned attributes and untags them cleanly", () => {
    const before = document.body.innerHTML;
    tagAnchors(document);
    expect(document.querySelector("rich-textarea .ql-editor")?.getAttribute(ANCHOR_ATTR)).toBe("promptInput");
    expect(document.querySelector("bard-sidenav")?.getAttribute(ANCHOR_ATTR)).toBe("sidebar");
    untagAll(document);
    expect(document.body.innerHTML).toBe(before);
  });

  it("tagging is idempotent", () => {
    tagAnchors(document);
    const once = document.body.innerHTML;
    tagAnchors(document);
    expect(document.body.innerHTML).toBe(once);
  });

  it("does not touch the prompt input's content or attributes other than the anchor", () => {
    const input = document.querySelector<HTMLElement>(".ql-editor")!;
    input.textContent = "user text";
    tagAnchors(document);
    expect(input.textContent).toBe("user text");
    expect(input.getAttribute("contenteditable")).toBe("true");
  });

  it("uses fallback selectors when the primary one stops matching", () => {
    document.querySelector("infinite-scroller")!.removeAttribute("data-test-id");
    const status = scanAnchors(document).find((a) => a.key === "chatHistory")!;
    expect(status.found).toBe(true);
    expect(status.matchedSelector).toBe("#chat-history");
  });

  it("tags every match for collection anchors", () => {
    const history = document.querySelector("infinite-scroller")!;
    history.innerHTML = "<user-query></user-query><model-response></model-response><user-query></user-query>";
    const status = tagAnchors(document).find((a) => a.key === "userQuery")!;
    expect(status.count).toBe(2);
    expect(document.querySelectorAll(`[${ANCHOR_ATTR}="userQuery"]`)).toHaveLength(2);
  });

  it("reports the sidebar missing (not mis-tagged) before Gemini renders it", () => {
    // Live behavior: <bard-sidenav> appears ~1s after hydration.
    document.querySelector("bard-sidenav")!.remove();
    const statuses = tagAnchors(document);
    expect(statuses.find((a) => a.key === "sidebar")!.found).toBe(false);
    expect(document.querySelector("bard-sidenav-content")!.getAttribute(ANCHOR_ATTR)).toBe("mainContent");
    expect(document.querySelectorAll(`[${ANCHOR_ATTR}="sidebar"]`)).toHaveLength(0);
  });

  it("recognises the mobile drawer (mat-sidenav) and its nav items; a missing sidebar is not degraded", () => {
    // Live behavior at 375px: no <bard-sidenav>; nav lives in an overlay <mat-sidenav> drawer.
    const desktop = document.querySelector("bard-sidenav")!;
    const content = desktop.querySelector("side-navigation-content")!;
    const drawer = document.createElement("mat-sidenav");
    drawer.appendChild(content);
    desktop.replaceWith(drawer);
    const statuses = tagAnchors(document);
    expect(drawer.getAttribute(ANCHOR_ATTR)).toBe("sidebar");
    expect(document.querySelector('a[href="/images"]')!.getAttribute(ANCHOR_ATTR)).toBe("navItem");
    drawer.remove();
    expect(evaluateCompatibility(scanAnchors(document)).level).toBe("ok");
    expect(statuses.find((s) => s.key === "sidebar")!.matchedSelector).toBe("side-navigation-v2 mat-sidenav");
  });

  it("an element is claimed by only one anchor", () => {
    const defs: AnchorDefinition[] = [
      { key: "sidebar", selectors: ["bard-sidenav-content"], required: true, multiple: false, verified: false },
      { key: "mainContent", selectors: ["bard-sidenav-content"], required: true, multiple: false, verified: false },
    ];
    const statuses = tagAnchors(document, defs);
    expect(statuses.map((s) => s.found)).toEqual([true, false]);
    expect(document.querySelector("bard-sidenav-content")!.getAttribute(ANCHOR_ATTR)).toBe("sidebar");
  });

  it("removes stale tags when an element stops matching", () => {
    tagAnchors(document);
    const history = document.querySelector("infinite-scroller")!;
    expect(history.getAttribute(ANCHOR_ATTR)).toBe("chatHistory");
    history.removeAttribute("data-test-id");
    document.querySelector("#chat-history")!.removeAttribute("id");
    tagAnchors(document);
    expect(history.hasAttribute(ANCHOR_ATTR)).toBe(false);
  });

  it("tags the P1 sub-anchors, and the current nav item is not also tagged as a plain item", () => {
    tagAnchors(document);
    const tag = (s: string) => document.querySelector(s)?.getAttribute(ANCHOR_ATTR);
    expect(tag(".lm-glow")).toBe("zeroStateGlow");
    expect(tag("h1")).toBe("zeroStateHeading");
    expect(tag('[aria-label="New chat"]')).toBe("navItemCurrent");
    expect(tag('a[href="/images"]')).toBe("navItem");
    expect(tag(".input-area-container")).toBe("composerContainer");
    expect(tag(".text-input-field")).toBe("composerField");
    expect(tag('[aria-label="Send message"]')).toBe("sendButton");
  });

  it("tags conversation parts: bubble, inline code (not code blocks), response actions", () => {
    tagAnchors(document);
    const tag = (s: string) => document.querySelector(s)?.getAttribute(ANCHOR_ATTR) ?? null;
    expect(tag("user-query")).toBe("userQuery");
    expect(tag(".user-query-bubble-with-background")).toBe("userBubble");
    expect(tag("p > code")).toBe("inlineCode");
    expect(tag("pre > code")).toBeNull();
    expect(tag("message-actions")).toBe("responseActions");
  });

  it("does not style the user bubble while Gemini's edit box is open", () => {
    const bubble = document.querySelector(".user-query-bubble-with-background")!;
    tagAnchors(document);
    bubble.classList.add("edit-mode");
    tagAnchors(document);
    expect(bubble.hasAttribute(ANCHOR_ATTR)).toBe(false);
  });

  it("never throws on an invalid selector", () => {
    const defs: AnchorDefinition[] = [
      { key: "appRoot", selectors: ["::::bad", "chat-app"], required: true, multiple: false, verified: false },
    ];
    expect(() => scanAnchors(document, defs)).not.toThrow();
    expect(scanAnchors(document, defs)[0]!.matchedSelector).toBe("chat-app");
  });

  it("every anchor definition has at least one selector", () => {
    for (const def of ANCHORS) expect(def.selectors.length).toBeGreaterThan(0);
  });
});

describe("color scheme detection", () => {
  afterEach(() => {
    document.body.className = "";
    document.body.style.backgroundColor = "";
  });

  it("follows Gemini's body class", () => {
    document.body.className = "theme-host dark-theme";
    expect(detectColorScheme(document)).toBe("dark");
    document.body.className = "theme-host light-theme";
    expect(detectColorScheme(document)).toBe("light");
  });

  it("falls back to background luminance when the class is unknown", () => {
    document.body.style.backgroundColor = "rgb(252, 252, 252)";
    expect(detectColorScheme(document)).toBe("light");
    document.body.style.backgroundColor = "rgb(15, 15, 15)";
    expect(detectColorScheme(document)).toBe("dark");
  });
});

describe("compatibility report", () => {
  it("is degraded when a required anchor is missing", () => {
    document.querySelector("input-container")!.remove();
    const report = evaluateCompatibility(scanAnchors(document));
    expect(report.level).toBe("degraded");
    expect(report.missingRequired).toEqual(expect.arrayContaining(["composer", "promptInput"]));
  });

  it("is unsupported when the app root is missing", () => {
    document.body.innerHTML = "<div>Some other page</div>";
    expect(evaluateCompatibility(scanAnchors(document)).level).toBe("unsupported");
  });

  it("optional anchors (messages) do not degrade the zero-state page", () => {
    document.querySelector(".conversation-container")!.remove();
    const report = evaluateCompatibility(scanAnchors(document));
    expect(report.anchors.find((a) => a.key === "userQuery")?.found).toBe(false);
    expect(report.level).toBe("ok");
  });
});

describe("observer and routes", () => {
  it("debounces bursts of DOM mutations into one callback", async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const observer = createDomObserver(document.body, onChange, 100);
    observer.start();
    observer.start(); // duplicate start must not double-observe
    for (let i = 0; i < 20; i++) document.body.appendChild(document.createElement("p"));
    await Promise.resolve(); // let MutationObserver deliver
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledTimes(1);
    observer.stop();
    document.body.appendChild(document.createElement("p"));
    await Promise.resolve();
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("ignores attribute-only mutations (our own tagging)", async () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const observer = createDomObserver(document.body, onChange, 50);
    observer.start();
    tagAnchors(document);
    await Promise.resolve();
    vi.advanceTimersByTime(50);
    expect(onChange).not.toHaveBeenCalled();
    observer.stop();
    vi.useRealTimers();
  });

  it("reports client-side route changes once", () => {
    const onRoute = vi.fn();
    const watcher = createRouteWatcher(onRoute);
    watcher.check();
    expect(onRoute).not.toHaveBeenCalled();
    history.pushState({}, "", "/app/abc123");
    watcher.check();
    watcher.check();
    expect(onRoute).toHaveBeenCalledTimes(1);
    watcher.stop();
    history.pushState({}, "", "/");
  });
});
