import fs from "node:fs";
import { roundSVG, inspectRoundness } from "./round-svg.mjs";
const check = process.argv.includes("--check"),
  preview = process.argv.includes("--preview");
const catalog = JSON.parse(fs.readFileSync("assets/catalog.json"));
const weights = process.argv.includes("--all-weights")
  ? ["thin", "light", "regular", "bold", "fill", "duotone"]
  : ["regular"];
if (weights.length > 1 && !check)
  throw Error("Derived weights are read-only; regenerate with assemble.");
const report = {
  icons: catalog.length,
  variants: catalog.length * weights.length,
  changed: 0,
  elements: 0,
  corners: 0,
  rectangles: 0,
  remaining: [],
  details: [],
};
const output = [];
for (const weight of weights)
  for (const { name } of catalog) {
    const path = `assets/${weight}/${name}.svg`,
      source = fs.readFileSync(path, "utf8");
    const before = inspectRoundness(source);
    const next = check
      ? { source, corners: 0, rectangles: 0 }
      : roundSVG(source);
    const after = inspectRoundness(next.source);
    report.elements += after.elements;
    report.corners += next.corners;
    report.rectangles += next.rectangles;
    if (next.corners || next.rectangles) report.changed++;
    if (after.issues.length)
      report.remaining.push({ name, weight, issues: after.issues });
    report.details.push({
      name,
      weight,
      elements: after.elements,
      roundedCorners: next.corners,
      roundedRectangles: next.rectangles,
      before: before.issues.length,
      after: after.issues.length,
    });
    output.push({ path, source: next.source });
  }
if (!check) {
  fs.mkdirSync("design/roundness", { recursive: true });
  fs.writeFileSync(
    "design/roundness/report.json",
    JSON.stringify(report, null, 2) + "\n",
  );
}
console.log(
  JSON.stringify(
    { ...report, details: undefined, remaining: report.remaining.slice(0, 15) },
    null,
    2,
  ),
);
if (report.remaining.length) {
  console.error(
    `${report.remaining.length} icons still have non-rounded geometry. No artwork written.`,
  );
  process.exitCode = 1;
} else if (!check && !preview)
  for (const file of output) fs.writeFileSync(file.path, file.source);
