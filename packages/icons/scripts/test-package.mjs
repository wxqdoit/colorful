import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { runInNewContext } from "node:vm";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dependencyRoot = resolve(root, "../..", "node_modules");
const temporary = mkdtempSync(resolve(tmpdir(), "colorful-package-"));
const name = "@colorful-icon/react";
const catalogCount = JSON.parse(
  readFileSync(resolve(root, "assets/catalog.json"), "utf8"),
).length;
const run = (args) =>
  execFileSync(process.execPath, args, { cwd: temporary, encoding: "utf8" });
try {
  const packed = JSON.parse(
    execFileSync(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", temporary],
      { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
    ),
  )[0];
  assert(
    packed.size < 5_000_000,
    `Published tarball exceeds 5 MB: ${packed.size} bytes`,
  );
  assert(packed.files.some((f) => f.path === "dist/ssr/index.es.js"));
  assert(!packed.files.some((f) => f.path.startsWith("assets/")));
  assert(packed.files.some((f) => f.path === "dist/theme.css"));
  assert(packed.files.some((f) => f.path === "dist/motion.css"));
  assert(packed.files.some((f) => f.path === "LICENSE"));
  assert(packed.files.some((f) => f.path === "NOTICE.md"));
  const installed = resolve(temporary, "node_modules", name);
  mkdirSync(installed, { recursive: true });
  execFileSync("tar", [
    "-xzf",
    resolve(temporary, packed.filename),
    "--strip-components=1",
    "-C",
    installed,
  ]);
  for (const dependency of ["react", "react-dom", "@types"])
    symlinkSync(
      resolve(dependencyRoot, dependency),
      resolve(temporary, "node_modules", dependency),
      "dir",
    );
  writeFileSync(resolve(temporary, "package.json"), '{"type":"module"}');
  const entrypoints = [
    "",
    "/ssr",
    "/dist/ssr",
    "/Story",
    "/dist/csr/Story",
    "/dist/icons/Story",
    "/dist/ssr/Story",
  ];
  for (const entry of entrypoints) {
    for (const mode of ["import", "require"]) {
      const load =
        mode === "import"
          ? `await import(${JSON.stringify(name + entry)})`
          : `require(${JSON.stringify(name + entry)})`;
      const script = `${mode === "import" ? 'import assert from "node:assert/strict"; import {createElement} from "react"; import {renderToStaticMarkup} from "react-dom/server";' : 'const assert=require("node:assert/strict"),{createElement}=require("react"),{renderToStaticMarkup}=require("react-dom/server");'} const m=${load}; assert(m.StoryIcon); assert.equal(m.StoryIcon,m.Story); const s=renderToStaticMarkup(createElement(m.StoryIcon,{alt:"Book",size:32})); assert(s.includes('width="32"')); assert(s.includes('<title>Book</title>'));`;
      run([
        ...(mode === "import" ? ["--input-type=module"] : []),
        "-e",
        script,
      ]);
    }
  }
  for (const entry of ["/ssr", "/dist/ssr", "/dist/ssr/Story"]) {
    run([
      "--conditions=react-server",
      "--input-type=module",
      "-e",
      `const m=await import(${JSON.stringify(name + entry)}); if(!m.StoryIcon) throw Error("No server icon");`,
    ]);
    run([
      "--conditions=react-server",
      "-e",
      `const m=require(${JSON.stringify(name + entry)}); if(!m.StoryIcon) throw Error("No server icon");`,
    ]);
  }
  for (const entry of ["", "/ssr", "/OriginalClubArmchair", "/dist/ssr/OriginalClubArmchair"]) {
    for (const mode of ["import", "require"]) {
      const load = mode === "import"
        ? `await import(${JSON.stringify(name + entry)})`
        : `require(${JSON.stringify(name + entry)})`;
      run([
        ...(mode === "import" ? ["--input-type=module"] : []),
        "-e",
        `${mode === "import" ? 'import assert from "node:assert/strict"; import {createElement} from "react"; import {renderToStaticMarkup} from "react-dom/server";' : 'const assert=require("node:assert/strict"),{createElement}=require("react"),{renderToStaticMarkup}=require("react-dom/server");'} const m=${load}; assert(m.OriginalClubArmchairIcon); for(const weight of ["thin","light","regular","bold","fill","duotone"]) { const svg=renderToStaticMarkup(createElement(m.OriginalClubArmchairIcon,{weight,size:40})); assert(svg.includes('width="40"')); assert(svg.includes('<path')); }`,
      ]);
    }
  }
  run([
    "--input-type=module",
    "-e",
    `import {iconCatalog} from '${name}/catalog'; import {IconBase,SSRBase,IconContext} from '${name}/lib'; import assert from 'node:assert/strict'; assert.equal(iconCatalog.length,${catalogCount}); assert(IconBase && SSRBase && IconContext);`,
  ]);
  run([
    "--input-type=module", "-e",
    `import {createElement,Fragment} from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import {StoryIcon,MotionStyles} from '${name}/ssr'; import assert from 'node:assert/strict'; const html=renderToStaticMarkup(createElement(Fragment,null,createElement(MotionStyles),createElement(StoryIcon,{entrance:'pop'}),createElement(StoryIcon,{hoverAnimation:'morph'}))); assert.equal((html.match(/<style/g)||[]).length,1); assert(html.includes('@keyframes colorful-pop')); assert(!renderToStaticMarkup(createElement(StoryIcon,{entrance:'pop',motionStyles:'manual'})).includes('<style'));`,
  ]);
  for (const file of [
    "dist/csr/Story.es.js",
    "dist/csr/Story.cjs",
    "dist/lib/IconBase.es.js",
    "dist/lib/context.es.js",
  ]) {
    assert.match(
      readFileSync(resolve(installed, file), "utf8"),
      /^"use client";/,
    );
  }

  writeFileSync(
    resolve(temporary, "consumer.tsx"),
    `import {createRef} from "react";\nimport {StoryIcon, type Icon, type IconProps, IconContext} from "${name}";\nimport {StoryIcon as Server} from "${name}/ssr";\nimport {StoryIcon as Direct} from "${name}/Story";\nconst I: Icon = StoryIcon;\nconst props: IconProps = {palette:{surface:"pink"},theme:"dark",preset:"mint",entrance:"pop",hoverAnimation:"morph",hoverEasing:"spring",hoverDuration:700,hoverStagger:60,hoverReplayKey:1,animationKey:1,mirrorDuration:320,weight:"bold",style:{"--project-art-back":"red"}};\nconst result = <IconContext.Provider value={{size:26}}><I {...props} ref={createRef<SVGSVGElement>()}/><Server/><Direct/></IconContext.Provider>;\n// @ts-expect-error invalid weight must be rejected\nconst invalid = <I weight="heavy"/>;\n`,
  );
  run([
    resolve(dependencyRoot, "typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--jsx",
    "react-jsx",
    "--module",
    "ESNext",
    "--moduleResolution",
    "Bundler",
    "--target",
    "ES2020",
    "consumer.tsx",
  ]);
  run([
    resolve(dependencyRoot, "typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--jsx",
    "react-jsx",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2020",
    "consumer.tsx",
  ]);
  writeFileSync(resolve(temporary, "package.json"), '{"type":"commonjs"}');
  run([
    resolve(dependencyRoot, "typescript/bin/tsc"),
    "--noEmit",
    "--strict",
    "--skipLibCheck",
    "--jsx",
    "react-jsx",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--target",
    "ES2020",
    "consumer.tsx",
  ]);
  writeFileSync(resolve(temporary, "package.json"), '{"type":"module"}');
  const context = { React };
  runInNewContext(
    readFileSync(resolve(installed, "dist/index.umd.js"), "utf8"),
    context,
  );
  assert(context.Colorful.StoryIcon);
  assert(
    renderToStaticMarkup(
      React.createElement(context.Colorful.StoryIcon),
    ).includes('viewBox="0 0 24 24"'),
  );

  const bundled = await build({
    stdin: {
      contents: `import { StoryIcon } from '${name}'; export { StoryIcon };`,
      resolveDir: temporary,
    },
    bundle: true,
    write: false,
    format: "esm",
    minify: true,
    metafile: true,
    external: ["react", "react/*"],
  });
  const included = Object.values(bundled.metafile.outputs).flatMap((o) =>
    Object.entries(o.inputs)
      .filter(([, v]) => v.bytesInOutput > 0)
      .map(([p]) => p),
  );
  assert(included.some((p) => p.endsWith("defs/Story.es.js")));
  assert(
    !included.some((p) => /defs\/(?!Story\.)/.test(p)),
    `Unused artwork bundled: ${included}`,
  );
  assert(
    !included.some((p) => p.includes("/ssr/")),
    "Unused SSR components bundled",
  );
  console.log(
    `Package checks passed: packed tarball, 22 ESM/CJS entry imports including all six original weights, 6 server-condition imports, Bundler/NodeNext ESM+CJS types, UMD, client boundaries and tree shaking (${bundled.outputFiles[0].contents.length} bytes, React external).`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
