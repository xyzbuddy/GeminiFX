/**
 * Debounced MutationObserver. Watches only childList changes (not attributes),
 * so GeminiFX's own attribute tagging never re-triggers it. Bursts of mutations
 * during streaming responses collapse into a single callback.
 */

export interface DomObserver {
  start(): void;
  stop(): void;
  readonly running: boolean;
}

/**
 * Watches specific attributes on a single element (no subtree), e.g. <body class>
 * for Gemini's light/dark switch. Calls back only when a watched value changes.
 */
export function createAttributeObserver(target: Element, attributes: string[], onChange: () => void): () => void {
  const observer = new MutationObserver(() => onChange());
  observer.observe(target, { attributes: true, attributeFilter: attributes });
  return () => observer.disconnect();
}

export function createDomObserver(target: Node, onChange: () => void, debounceMs: number): DomObserver {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  const flush = () => {
    timer = null;
    onChange();
  };

  const observer = new MutationObserver((mutations) => {
    if (!mutations.some((m) => m.addedNodes.length > 0 || m.removedNodes.length > 0)) return;
    if (timer === null) timer = setTimeout(flush, debounceMs);
  });

  return {
    start() {
      if (running) return;
      observer.observe(target, { childList: true, subtree: true });
      running = true;
    },
    stop() {
      observer.disconnect();
      if (timer !== null) clearTimeout(timer);
      timer = null;
      running = false;
    },
    get running() {
      return running;
    },
  };
}
