import { dirname, resolve } from "node:path";
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@colorful-icon/react/catalog",
        replacement: resolve("src/catalog.ts"),
      },
      { find: "@colorful-icon/react", replacement: resolve("src/index.ts") },
    ],
  },
  plugins: [
    react(),
    dts({
      include: ["src"],
      exclude: ["test", "example"],
      beforeWriteFile(filePath, content) {
        // Explicit relative extensions keep exported declarations valid in NodeNext.
        return {
          filePath,
          content: content.replace(
            /(from\s+["'])(\.[^"']+)(["'])/g,
            (_, before, specifier, after) => {
              const sourcePath = resolve(
                dirname(
                  filePath.replace(`${resolve("dist")}/`, `${resolve("src")}/`),
                ),
                specifier,
              );
              const suffix =
                existsSync(`${sourcePath}.ts`) ||
                existsSync(`${sourcePath}.tsx`)
                  ? ".js"
                  : "/index.js";
              return before + specifier + suffix + after;
            },
          ),
        };
      },
      afterBuild(files) {
        for (const [file, content] of files) {
          if (!file.endsWith(".d.ts")) continue;
          writeFileSync(
            file.replace(/\.d\.ts$/, ".d.cts"),
            content.replace(/(from\s+["']\.[^"']+)\.js(["'])/g, "$1.cjs$2"),
          );
        }
      },
    }),
    {
      name: "colorful-client-boundaries",
      renderChunk(code, chunk) {
        if (
          chunk.facadeModuleId &&
          /\/src\/(csr\/|lib\/(context|IconBase)\.)/.test(chunk.facadeModuleId)
        ) {
          return { code: '"use client";\n' + code, map: null };
        }
      },
      closeBundle() {
        for (const file of ["theme.css", "motion.css"])
          copyFileSync(`src/${file}`, `dist/${file}`);
      },
    },
  ],
  build: {
    target: "es2020",
    // Published modules are data-heavy (2,519 SVG trees); minifying the
    // generated JSX keeps the single-artwork package below the size budget.
    minify: true,
    lib: { entry: resolve("src/index.ts") },
    rollupOptions: {
      input: {
        index: "src/index.ts",
        "ssr/index": "src/ssr/index.ts",
        "lib/index": "src/lib/index.ts",
        catalog: "src/catalog.ts",
      },
      external: (id) => /^react(?:\/|$)/.test(id),
      onwarn(warning, warn) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        warn(warning);
      },
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].es.js",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          exports: "named",
        },
      ],
    },
  },
  test: {
    environment: "jsdom",
    css: { include: [/motion\.css/] },
    include: ["test/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
});
