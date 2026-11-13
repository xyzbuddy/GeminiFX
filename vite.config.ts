import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/**
 * Main build: popup (React, HTML entry) + background service worker (ES module).
 * The content script is built separately (vite.content.config.ts) because
 * MV3 content scripts cannot be ES modules and must be a single classic script.
 */
export default defineConfig({
  root: resolve(import.meta.dirname, "src"),
  publicDir: resolve(import.meta.dirname, "public"),
  base: "./",
  plugins: [react()],
  build: {
    // Committed, ready-to-load folder (see README). Stable names keep git diffs small.
    outDir: resolve(import.meta.dirname, "extension"),
    emptyOutDir: true,
    target: "chrome114",
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, "src/popup/index.html"),
        "service-worker": resolve(import.meta.dirname, "src/background/service-worker.ts"),
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "service-worker" ? "service-worker.js" : "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]",
      },
    },
  },
});
