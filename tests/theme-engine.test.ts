import { afterEach, describe, expect, it } from "vitest";
import { ROOT_COMPACT_ATTR, ROOT_ENABLED_ATTR, ROOT_THEME_ATTR, STYLE_ELEMENT_ID } from "../src/core/constants";
import { SETTING_TOKENS, applyTheme, buildTokenOverrides, clearTheme } from "../src/core/theme-engine";
import { UiEngine } from "../src/core/ui-engine";
import { DEFAULT_SETTINGS } from "../src/settings/defaults";

const root = document.documentElement;

afterEach(() => {
  clearTheme(root);
  root.removeAttribute(ROOT_ENABLED_ATTR);
  document.getElementById(STYLE_ELEMENT_ID)?.remove();
});

describe("theme engine", () => {
  it("maps settings to CSS tokens", () => {
    expect(buildTokenOverrides({ ...DEFAULT_SETTINGS, sidebarWidth: 300, accentColor: "#123456" })).toEqual({
      "--geminifx-accent": "#123456",
      "--geminifx-sidebar-width": "300px",
      "--geminifx-content-width": "768px",
      "--geminifx-font-size": "16px",
    });
  });

  it("applies theme attribute, compact flag and tokens", () => {
    applyTheme(root, { ...DEFAULT_SETTINGS, theme: "midnight", compactMode: true });
    expect(root.getAttribute(ROOT_THEME_ATTR)).toBe("midnight");
    expect(root.hasAttribute(ROOT_COMPACT_ATTR)).toBe(true);
    expect(root.style.getPropertyValue("--geminifx-sidebar-width")).toBe("260px");
  });

  it("switching theme only changes attributes (no DOM replacement)", () => {
    const body = document.body;
    applyTheme(root, { ...DEFAULT_SETTINGS, theme: "midnight" });
    applyTheme(root, { ...DEFAULT_SETTINGS, theme: "oled-black" });
    expect(root.getAttribute(ROOT_THEME_ATTR)).toBe("oled-black");
    expect(document.body).toBe(body);
  });

  it("clearTheme removes everything it set", () => {
    applyTheme(root, { ...DEFAULT_SETTINGS, compactMode: true });
    clearTheme(root);
    expect(root.hasAttribute(ROOT_THEME_ATTR)).toBe(false);
    expect(root.hasAttribute(ROOT_COMPACT_ATTR)).toBe(false);
    for (const token of SETTING_TOKENS) expect(root.style.getPropertyValue(token)).toBe("");
  });
});

describe("UiEngine", () => {
  it("injects exactly one style element even when enabled repeatedly", () => {
    const engine = new UiEngine(document, "html{}");
    engine.enable(DEFAULT_SETTINGS);
    engine.enable(DEFAULT_SETTINGS);
    expect(document.querySelectorAll(`#${STYLE_ELEMENT_ID}`)).toHaveLength(1);
    expect(root.getAttribute(ROOT_ENABLED_ATTR)).toBe("on");
  });

  it("disable restores the page to its original state", () => {
    const before = root.outerHTML;
    const engine = new UiEngine(document, "html{}");
    engine.enable({ ...DEFAULT_SETTINGS, compactMode: true });
    engine.setScheme("light");
    engine.disable();
    expect(root.outerHTML).toBe(before);
    expect(engine.isEnabled).toBe(false);
  });

  it("setScheme mirrors Gemini's mode only while enabled", () => {
    const engine = new UiEngine(document, "html{}");
    engine.setScheme("light");
    expect(root.hasAttribute("data-geminifx-scheme")).toBe(false);
    engine.enable(DEFAULT_SETTINGS);
    engine.setScheme("light");
    expect(root.getAttribute("data-geminifx-scheme")).toBe("light");
    engine.disable();
    expect(root.hasAttribute("data-geminifx-scheme")).toBe(false);
  });
});
