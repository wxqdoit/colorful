import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { rmSync } from "node:fs";

const require = createRequire(import.meta.url);
const vite = resolve(dirname(require.resolve("vite/package.json")), "bin/vite.js");
rmSync(resolve("dist"), { recursive: true, force: true });
// The full 2,519-icon module graph plus declarations exceeds Node's default 4 GB heap.
// Give each build its own process so ESM/CJS memory is released before bundling UMD.
for (const args of [[], ["--config", "vite.umd.config.ts"]]) {
  const result = spawnSync(
    process.execPath,
    ["--max-old-space-size=8192", vite, "build", ...args],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
