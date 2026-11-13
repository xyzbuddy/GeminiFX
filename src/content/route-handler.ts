/**
 * Detects Gemini's client-side route changes (new chat, opening a conversation)
 * without patching history.pushState, which would mean modifying Gemini's
 * page-world JavaScript. Sources:
 *   - popstate (back/forward)
 *   - `check()`, called by the DOM observer after each debounced mutation batch,
 *     since Angular route changes always re-render part of the DOM.
 */

export interface RouteWatcher {
  check(): void;
  stop(): void;
}

export function createRouteWatcher(onRouteChange: (url: string) => void, win: Window = window): RouteWatcher {
  let lastUrl = win.location.href;

  const check = () => {
    const url = win.location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      onRouteChange(url);
    }
  };

  win.addEventListener("popstate", check);

  return {
    check,
    stop() {
      win.removeEventListener("popstate", check);
    },
  };
}
