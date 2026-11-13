import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Content-script build: a single self-contained IIFE (extension/content.js).
 * CSS is imported with `?inline` and injected at runtime, so disabling
 * GeminiFX can remove it completely.
 */
export default defineConfig({
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, "extension"),
    emptyOutDir: false,
    target: "chrome114",
    sourcemap: false,
    lib: {
      entry: resolve(import.meta.dirname, "src/content/index.ts"),
      name: "GeminiFX",
      formats: ["iife"],
      fileName: () => "content.js",
    },
  },
});
