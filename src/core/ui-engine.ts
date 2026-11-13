import { ROOT_ENABLED_ATTR, ROOT_SCHEME_ATTR, STYLE_ELEMENT_ID } from "./constants";
import { applyTheme, clearTheme } from "./theme-engine";
import type { GeminiFXSettings } from "../settings/schema";

/**
 * Owns everything GeminiFX adds to the page at the document level:
 * one <style> element and a few attributes/properties on <html>.
 * `disable()` removes all of it, restoring Gemini's native appearance.
 * Element-level anchor tags are handled by content/dom-adapter.ts.
 */
export class UiEngine {
  private enabled = false;

  constructor(
    private readonly doc: Document,
    private readonly cssText: string,
  ) {}

  get isEnabled(): boolean {
    return this.enabled;
  }

  enable(settings: GeminiFXSettings): void {
    const root = this.doc.documentElement;
    this.mountStyles();
    root.setAttribute(ROOT_ENABLED_ATTR, "on");
    applyTheme(root, settings);
    this.enabled = true;
  }

  /** Mirror Gemini's light/dark mode so theme tokens can switch with it. */
  setScheme(scheme: "dark" | "light"): void {
    if (!this.enabled) return;
    const root = this.doc.documentElement;
    if (root.getAttribute(ROOT_SCHEME_ATTR) !== scheme) root.setAttribute(ROOT_SCHEME_ATTR, scheme);
  }

  disable(): void {
    const root = this.doc.documentElement;
    this.doc.getElementById(STYLE_ELEMENT_ID)?.remove();
    root.removeAttribute(ROOT_ENABLED_ATTR);
    root.removeAttribute(ROOT_SCHEME_ATTR);
    clearTheme(root);
    this.enabled = false;
  }

  /** Inject the stylesheet once. At document_start <head> may not exist yet, so fall back to <html>. */
  private mountStyles(): void {
    const existing = this.doc.getElementById(STYLE_ELEMENT_ID);
    if (existing) {
      if (existing.textContent !== this.cssText) existing.textContent = this.cssText;
      return;
    }
    const style = this.doc.createElement("style");
    style.id = STYLE_ELEMENT_ID;
    style.textContent = this.cssText;
    (this.doc.head ?? this.doc.documentElement).appendChild(style);
  }
}
