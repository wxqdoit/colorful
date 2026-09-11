import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(resolve(root, "design/originals/catalog.json"), "utf8"),
);
if (catalog.length !== 1000)
  throw Error("Expected exactly 1000 original icons");
const staging = fs.mkdtempSync(resolve(tmpdir(), "colorful-originals-"));
const archive = resolve(tmpdir(), `colorful-originals-${process.pid}.zip`);
const target = resolve(root, "../../artifacts/colorful-originals-1000.zip");
try {
  for (const weight of [
    "thin",
    "light",
    "regular",
    "bold",
    "fill",
    "duotone",
  ]) {
    fs.mkdirSync(resolve(staging, weight));
    for (const { name } of catalog)
      fs.writeFileSync(
        resolve(staging, `${weight}/${name}.svg`),
        fs.readFileSync(resolve(root, `assets/${weight}/${name}.svg`), "utf8")
          .replace(/var\(--project-art-[a-z]+,\s*([^)]+)\)/g, "$1"),
      );
  }
  fs.writeFileSync(
    resolve(staging, "catalog.json"),
    JSON.stringify(catalog, null, 2) + "\n",
  );
  fs.copyFileSync(resolve(root, "LICENSE"), resolve(staging, "LICENSE"));
  fs.copyFileSync(resolve(root, "../../docs/originals-style.md"), resolve(staging, "STYLE.md"));
  fs.writeFileSync(
    resolve(staging, "README.md"),
    "# Colorful Originals\n\n1,000 original subjects × 6 styles = 6,000 editable SVGs.\n\nEach SVG uses standard hex fills from the three-color Lavender palette for design-tool compatibility. The React package retains dynamic color tokens and themes. The manifest contains Chinese names, English keywords, categories, component names and individual design notes.\n\nUse the same icons in React through @colorful-icons/react; motion styles are registered automatically for animated icons. SVG files in this archive are static artwork.\n",
  );
  execFileSync("zip", ["-qr", archive, "."], { cwd: staging });
  fs.mkdirSync(dirname(target), { recursive: true });
  fs.copyFileSync(archive, target);
  console.log(`Packed 1000 subjects / 6000 SVGs: ${target}`);
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
  fs.rmSync(archive, { force: true });
}
