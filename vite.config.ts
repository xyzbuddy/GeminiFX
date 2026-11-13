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
    outDir: resolve(import.meta.dirname, "dist"),
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
          chunk.name === "service-worker" ? "service-worker.js" : "assets/[name]-[hash].js",
      },
    },
  },
});
