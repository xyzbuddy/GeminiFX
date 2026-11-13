import tokensCss from "../themes/tokens.css?inline";
import themeCss from "../themes/chatgpt-inspired-dark.css?inline";
import bridgeCss from "../themes/gemini-bridge.css?inline";
import { MESSAGE_GET_STATUS, OBSERVER_DEBOUNCE_MS } from "../core/constants";
import { evaluateCompatibility, type CompatibilityReport } from "../core/compatibility";
import { SettingsManager } from "../core/settings-manager";
import { UiEngine } from "../core/ui-engine";
import type { GeminiFXSettings } from "../settings/schema";
import type { StatusResponse } from "../types/messages";
import { detectColorScheme, scanAnchors, tagAnchors, untagAll } from "./dom-adapter";
import { createAttributeObserver, createDomObserver } from "./observer";
import { createRouteWatcher } from "./route-handler";

/**
 * GeminiFX content script. Presentation layer only:
 *  - injects one GeminiFX-owned <style> and tags Gemini elements with data attributes;
 *  - never reads/modifies prompts, intercepts network, or touches Gemini's JS state.
 */

const INIT_FLAG = "__geminifxContentLoaded";
const scope = globalThis as typeof globalThis & { [INIT_FLAG]?: boolean };

/** Order: tokens (values) → theme (token values per scheme) → bridge (Gemini → tokens). */
const CSS_TEXT = [tokensCss, themeCss, bridgeCss].join("\n");

function extensionAlive(): boolean {
  try {
    return Boolean(chrome.runtime?.id);
  } catch {
    return false;
  }
}

function start(): void {
  const manager = new SettingsManager();
  const engine = new UiEngine(document, CSS_TEXT);
  let lastReport: CompatibilityReport | null = null;
  let stopSchemeWatch: (() => void) | null = null;

  const syncScheme = () => engine.setScheme(detectColorScheme(document));

  const refresh = () => {
    if (!extensionAlive()) {
      teardown();
      return;
    }
    if (!document.body) return;
    // Gemini's light/dark switch only changes <body class>, which the childList observer can't see.
    stopSchemeWatch ??= createAttributeObserver(document.body, ["class"], syncScheme);
    syncScheme();
    lastReport = evaluateCompatibility(tagAnchors(document));
    routes.check();
  };

  const observer = createDomObserver(document.documentElement, refresh, OBSERVER_DEBOUNCE_MS);
  const routes = createRouteWatcher(() => refresh());

  const apply = (settings: GeminiFXSettings) => {
    if (settings.enabled) {
      engine.enable(settings);
      observer.start();
      refresh();
    } else {
      observer.stop();
      stopSchemeWatch?.();
      stopSchemeWatch = null;
      untagAll(document);
      engine.disable();
    }
  };

  const onMessage = (
    message: unknown,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: StatusResponse) => void,
  ) => {
    if ((message as { type?: unknown } | null)?.type !== MESSAGE_GET_STATUS) return;
    const report = engine.isEnabled && lastReport ? lastReport : evaluateCompatibility(scanAnchors(document));
    sendResponse({ enabled: engine.isEnabled, report, url: location.href });
  };

  const unsubscribe = manager.subscribe(apply);

  function teardown() {
    observer.stop();
    routes.stop();
    stopSchemeWatch?.();
    stopSchemeWatch = null;
    unsubscribe();
    manager.dispose();
    try {
      chrome.runtime.onMessage.removeListener(onMessage);
    } catch {
      /* context invalidated */
    }
  }

  chrome.runtime.onMessage.addListener(onMessage);

  void manager.init().then((settings) => {
    apply(settings);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => engine.isEnabled && refresh(), { once: true });
    }
  });
}

if (!scope[INIT_FLAG]) {
  scope[INIT_FLAG] = true;
  start();
}
