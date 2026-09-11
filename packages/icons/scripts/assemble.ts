import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "@svgr/core";
import { JSDOM } from "jsdom";
import { withMotionLayers } from "./motion-layers";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const weights = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
] as const;
type Weight = (typeof weights)[number];
interface Entry {
  name: string;
  component: string;
  label: string;
  category: string;
  tags: string[];
}
const catalog: Entry[] = JSON.parse(
  readFileSync(resolve(root, "assets/catalog.json"), "utf8"),
);
const output = new Map<string, string>();
const generated =
  "/* GENERATED FILE — edit assets/regular, assets/overrides or assets/catalog.json; run npm run assemble. */\n";
const xmlEnvironment = new JSDOM();
const xmlParser = new xmlEnvironment.window.DOMParser();

function readSVG(source: string, file: string) {
  const document = xmlParser.parseFromString(source, "image/svg+xml");
  if (document.querySelector("parsererror"))
    throw new Error(`Invalid SVG XML: ${file}`);
  const svg = document.documentElement;
  if (svg.localName !== "svg" || svg.getAttribute("viewBox") !== "0 0 24 24")
    throw new Error(`Expected 24-unit SVG: ${file}`);
  for (const node of [svg, ...svg.querySelectorAll("*")]) {
    if (
      ![
        "svg",
        "g",
        "path",
        "circle",
        "ellipse",
        "rect",
        "line",
        "polyline",
        "polygon",
      ].includes(node.localName)
    )
      throw new Error(`Unsupported element ${node.localName}: ${file}`);
    for (const attr of node.attributes) {
      if (
        /^on|href|^id$|^style$/i.test(attr.name) ||
        /url\s*\(/i.test(attr.value)
      )
        throw new Error(`Unsupported attribute ${attr.name}: ${file}`);
    }
  }
  if (!svg.querySelector("path,circle,ellipse,rect,line,polyline,polygon"))
    throw new Error(`Missing artwork: ${file}`);
  return { svg };
}

function variant(source: string, weight: Weight, file: string) {
  const { svg } = readSVG(source, file);
  const widths = {
    thin: "0.45",
    light: "0.75",
    regular: "1.1",
    bold: "1.8",
    fill: "1.1",
    duotone: "1.1",
  };
  svg.setAttribute("stroke-width", widths[weight]);
  // Scale small optically tuned details too, rather than leaving them stuck
  // at the regular width when the surrounding icon changes weight.
  for (const node of svg.querySelectorAll("[stroke-width]")) {
    const localWidth = Number(node.getAttribute("stroke-width"));
    if (Number.isFinite(localWidth))
      node.setAttribute(
        "stroke-width",
        String(
          Number(((localWidth * Number(widths[weight])) / 1.1).toFixed(6)),
        ),
      );
  }
  for (const shape of svg.querySelectorAll(
    "path,circle,ellipse,rect,line,polyline,polygon",
  )) {
    const fill = shape.getAttribute("fill");
    // Filled artwork still needs its book spine, hands, arrows and status
    // marks. Preserve every part; fuller same-color edges add body without
    // introducing a dark outline or removing recognition details.
    if (
      weight === "fill" &&
      fill &&
      fill !== "none" &&
      shape.getAttribute("stroke") === "none"
    ) {
      shape.setAttribute("stroke", fill);
      shape.setAttribute(
        "stroke-width",
        fill.includes("--project-art-detail") ? "0.2" : "0.55",
      );
    }
    if (
      weight === "duotone" &&
      fill &&
      !fill.includes("--project-art-surface") &&
      fill !== "none"
    ) {
      shape.setAttribute("fill", "var(--project-art-detail, #aa8bcf)");
    }
  }
  const result = svg.outerHTML + "\n";
  return result;
}

// Validate the complete input before writing any generated files.
const names = new Set<string>();
const components = new Set<string>();
for (const entry of catalog) {
  if (
    !/^[a-z]+(?:-[a-z]+)*$/.test(entry.name) ||
    !/^[A-Z][A-Za-z]*$/.test(entry.component)
  )
    throw new Error(`Invalid icon name: ${entry.name}`);
  if (names.has(entry.name) || components.has(entry.component))
    throw new Error(`Duplicate icon: ${entry.name}`);
  if (!entry.label || !entry.category || !Array.isArray(entry.tags))
    throw new Error(`Incomplete catalog entry: ${entry.name}`);
  names.add(entry.name);
  components.add(entry.component);
}
const sourceFiles = readdirSync(resolve(root, "assets/regular")).filter((f) =>
  f.endsWith(".svg"),
);
if (
  sourceFiles.length !== names.size ||
  sourceFiles.some((f) => !names.has(f.slice(0, -4)))
)
  throw new Error(
    "assets/regular and catalog must contain exactly the same icons",
  );

for (const entry of catalog) {
  const source = readFileSync(
    resolve(root, `assets/regular/${entry.name}.svg`),
    "utf8",
  );
  const defs: string[] = [];
  const morphStyles = new Map<string, string>();
  for (const weight of weights) {
    const override = `assets/overrides/${weight}/${entry.name}.svg`;
    const svgText = existsSync(resolve(root, override))
      ? readFileSync(resolve(root, override), "utf8")
      : variant(source, weight, entry.name);
    const { svg } = readSVG(svgText, `${entry.name}/${weight}`);
    const strokeWidth = svg.getAttribute("stroke-width") ?? "1.1";
    const jsx = await transform(
      withMotionLayers(svgText, source),
      {
        plugins: ["@svgr/plugin-jsx"],
        typescript: true,
        jsxRuntime: "automatic",
        expandProps: false,
        svgo: false,
      },
      { componentName: "Artwork" },
    );
    const inner = jsx
      .match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/)?.[1]
      ?.replace(/style=\{\{([\s\S]*?)\}\}/g, (_, value: string) => {
        let name = morphStyles.get(value);
        if (!name) {
          name = `morph${morphStyles.size}`;
          morphStyles.set(value, name);
        }
        return `style={${name}}`;
      });
    if (!inner) throw new Error(`Cannot transform ${entry.name}/${weight}`);
    defs.push(`  ["${weight}", <g strokeWidth={${strokeWidth}}>${inner}</g>]`);
    if (weight !== "regular")
      output.set(`assets/${weight}/${entry.name}.svg`, svgText);
  }
  output.set(
    `src/defs/${entry.component}.tsx`,
    generated +
      `import type { ReactElement, CSSProperties } from "react";\nimport type { IconWeight } from "../lib/types";\n\n${[...morphStyles].map(([value, name]) => `const ${name} = {${value}} as CSSProperties;`).join("\n")}\n\nconst weights = new Map<IconWeight, ReactElement>([\n${defs.join(",\n")}\n]);\nexport default weights;\n`,
  );
  for (const kind of ["csr", "ssr"] as const) {
    const base = kind === "csr" ? "IconBase" : "SSRBase";
    output.set(
      `src/${kind}/${entry.component}.tsx`,
      (kind === "csr" ? '"use client";\n' : "") +
        generated +
        `import { forwardRef } from "react";\nimport type { Icon } from "../lib/types";\nimport ${base} from "../lib/${base}";\nimport weights from "../defs/${entry.component}";\n\n/** ${entry.label} · ${entry.category} */\nconst I: Icon = forwardRef((props, ref) => <${base} ref={ref} {...props} weights={weights} />);\nI.displayName = "${entry.component}Icon";\nexport { I as ${entry.component}Icon, I as ${entry.component} };\n`,
    );
  }
}
output.set(
  "src/index.ts",
  generated +
    'export * from "./lib";\nexport * as SSR from "./ssr";\n' +
    catalog.map((e) => `export * from "./csr/${e.component}";`).join("\n") +
    "\n",
);
output.set(
  "src/ssr/index.ts",
  generated +
    'export type { Icon, IconProps, IconWeight, IconTheme, IconPalette, IconStyle, IconBaseProps, IconPreset, IconEntrance, IconHover, IconEasing } from "../lib/types";\nexport { default as SSRBase } from "../lib/SSRBase";\nexport { MotionStyles } from "../lib/MotionStyles";\nexport { palettes, palettePresets } from "../lib/palette";\n' +
    catalog.map((e) => `export * from "./${e.component}";`).join("\n") +
    "\n",
);
output.set(
  "src/catalog.ts",
  generated +
    `export const iconCatalog = ${JSON.stringify(catalog, null, 2)} as const;\nexport type IconName = typeof iconCatalog[number]["name"];\n`,
);

const stale: string[] = [];
for (const dir of [
  "src/csr",
  "src/ssr",
  "src/defs",
  ...weights.filter((w) => w !== "regular").map((w) => `assets/${w}`),
]) {
  if (!existsSync(resolve(root, dir))) continue;
  for (const file of readdirSync(resolve(root, dir))) {
    if (/\.(tsx?|svg)$/.test(file) && !output.has(`${dir}/${file}`))
      stale.push(`${dir}/${file}`);
  }
}
if (stale.length)
  throw new Error(
    `Remove obsolete generated files after checking catalog changes:\n${stale.join("\n")}`,
  );
const drift: string[] = [];
for (const [file, content] of output) {
  const absolute = resolve(root, file);
  if (check) {
    if (!existsSync(absolute) || readFileSync(absolute, "utf8") !== content)
      drift.push(file);
  } else {
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, content);
  }
}
if (drift.length)
  throw new Error(
    `Generated files are out of date. Run npm run assemble:\n${drift.join("\n")}`,
  );
console.log(
  `${check ? "Verified" : "Generated"} ${catalog.length} icons × ${weights.length} weights; CSR, SSR and SVG exports.`,
);
xmlEnvironment.window.close();
