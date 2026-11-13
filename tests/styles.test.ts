import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ANCHORS } from "../src/content/dom-adapter";

const read = (f: string) => readFileSync(resolve(import.meta.dirname, "../src/themes", f), "utf8");
const FILES = ["tokens.css", "chatgpt-inspired-dark.css", "gemini-bridge.css"] as const;

/** Split "a, b:not(c, d)" on top-level commas only. */
function splitSelectors(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of list) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function selectorsOf(css: string): string[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const heads = [...clean.matchAll(/([^{}]+)\{/g)].map((m) => m[1]!.trim()).filter((h) => !h.startsWith("@"));
  return heads.flatMap(splitSelectors).map((s) => s.replace(/\s+/g, " "));
}

describe("theme CSS", () => {
  for (const file of FILES) {
    it(`${file}: every rule only applies while GeminiFX is enabled`, () => {
      const selectors = selectorsOf(read(file));
      expect(selectors.length).toBeGreaterThan(0);
      for (const s of selectors) expect(s.startsWith('html[data-geminifx="on"]'), s).toBe(true);
    });
  }

  it("theme file defines tokens only (no element or Gemini selectors)", () => {
    for (const s of selectorsOf(read("chatgpt-inspired-dark.css"))) {
      expect(s).toMatch(/^html(\[data-geminifx[-a-z]*="[^"]+"\])+$/);
    }
  });

  it("bridge only targets anchors that the adapter defines", () => {
    const keys = new Set(ANCHORS.map((a) => a.key));
    const used = [...read("gemini-bridge.css").matchAll(/data-geminifx-anchor="([^"]+)"/g)].map((m) => m[1]!);
    expect(used.length).toBeGreaterThan(0);
    for (const k of used) expect(keys.has(k as never), k).toBe(true);
  });

  it("does not use !important", () => {
    for (const file of FILES) expect(read(file).replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/!important/);
  });

  it("dark and light schemes define the same color tokens", () => {
    const css = read("chatgpt-inspired-dark.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const blocks = [...css.matchAll(/\{([^}]*)\}/g)].map((m) => new Set([...m[1]!.matchAll(/(--[\w-]+)\s*:/g)].map((x) => x[1])));
    expect(blocks).toHaveLength(2);
    expect([...blocks[1]!].sort()).toEqual([...blocks[0]!].sort());
  });

  it("every token the bridge uses is defined", () => {
    const defined = new Set(
      FILES.flatMap((f) => [...read(f).matchAll(/(--geminifx-[\w-]+)\s*:/g)].map((m) => m[1])),
    );
    const used = [...read("gemini-bridge.css").matchAll(/var\((--geminifx-[\w-]+)\)/g)].map((m) => m[1]!);
    for (const t of used) expect(defined.has(t), t).toBe(true);
  });
});
