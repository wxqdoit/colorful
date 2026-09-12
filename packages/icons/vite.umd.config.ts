import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "classic-react-for-umd",
      enforce: "pre",
      transform(code, id) {
        if (id.includes("/src/") && /\.tsx?$/.test(id))
          return {
            code:
              (id.endsWith(".tsx") ? 'import * as React from "react";\n' : "") +
              code.replace(/^"use client";\n/, ""),
            map: null,
          };
      },
    },
  ],
  esbuild: {
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
  build: {
    emptyOutDir: false,
    target: "es2020",
    lib: {
      entry: "src/index.ts",
      name: "Colorful",
      formats: ["umd"],
      fileName: () => "index.umd.js",
    },
    rollupOptions: {
      external: ["react"],
      output: { globals: { react: "React" } },
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
    },
  },
});
