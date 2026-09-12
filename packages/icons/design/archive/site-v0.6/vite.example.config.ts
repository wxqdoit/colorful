import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "example",
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@colorful-icon/react/catalog",
        replacement: resolve("src/catalog.ts"),
      },
      { find: "@colorful-icon/react", replacement: resolve("src/index.ts") },
    ],
  },
  server: { port: 5173, strictPort: true },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve("example/index.html"),
        review: resolve("example/design-review.html"),
      },
      output: {
        manualChunks(id) {
          if (id.endsWith("/src/catalog.ts")) return "catalog";
        },
      },
    },
  },
});
