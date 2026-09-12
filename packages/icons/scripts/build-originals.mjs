import fs from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { inspectOriginal } from "../design/originals/validate.mjs";
import { inspectRoundness } from "./round-svg.mjs";
import { styledOriginal, inspectStyle } from "../design/originals/style.mjs";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packs = [
  ["living", 330],
  ["nature", 340],
  ["places", 330],
];
const check = process.argv.includes("--check");
const output = [];
const issues = [];
const slugs = new Set();
const hashes = new Map();
for (const [pack, count] of packs) {
  const { originals } = await import(`../design/originals/${pack}.mjs`);
  if (originals.length !== count)
    issues.push(`${pack}: expected ${count}, got ${originals.length}`);
  for (const entry of originals) {
    const { slug, label, category, family, concept, body, tags } = entry;
    if (!/^[a-z]+(?:-[a-z]+)*$/.test(slug) || slugs.has(slug))
      issues.push(`invalid or duplicate slug ${slug}`);
    slugs.add(slug);
    if (
      !label ||
      !category ||
      !family ||
      !concept ||
      concept.length < 6 ||
      !Array.isArray(tags)
    )
      issues.push(`incomplete metadata ${slug}`);
    const source = styledOriginal(entry);
    const inspection = inspectOriginal(source);
    const style = inspectStyle(source);
    const roundness = inspectRoundness(source);
    for (const problem of [
      ...inspection.issues,
      ...style.issues,
      ...roundness.issues.map((x) => JSON.stringify(x)),
    ])
      issues.push(`${slug}: ${problem}`);
    if (hashes.has(inspection.geometryHash))
      issues.push(
        `${slug}: same geometry as ${hashes.get(inspection.geometryHash)}`,
      );
    hashes.set(inspection.geometryHash, slug);
    const name = `original-${slug}`;
    const component =
      "Original" +
      slug
        .split("-")
        .map((x) => x[0].toUpperCase() + x.slice(1))
        .join("");
    const catalogEntry = {
      name,
      component,
      label,
      category,
      tags: [
        ...new Set([...tags, slug.replaceAll("-", " "), "original", "原创"]),
      ],
      source: "colorful-original",
      collection: "originals",
      designStatus: "original",
      designFamily: family,
    };
    output.push({
      entry: catalogEntry,
      source,
      note: { name, group: `originals-${pack}`, family, visualReason: concept },
      inspection,
      style,
    });
  }
}
// Interleave subjects by category so the gallery opens with the full range of objects.
// This only orders the catalog; it never alters or invents drawings.
const categoryQueues = new Map();
for (const item of output) {
  const key = item.entry.category;
  if (!categoryQueues.has(key)) categoryQueues.set(key, []);
  categoryQueues.get(key).push(item);
}
output.length = 0;
while ([...categoryQueues.values()].some((queue) => queue.length)) {
  for (const queue of categoryQueues.values())
    if (queue.length) output.push(queue.shift());
}
if (output.length !== 1000)
  issues.push(`Expected 1000 originals, got ${output.length}`);
const catalogFile = resolve(root, "assets/catalog.json");
const existing = JSON.parse(fs.readFileSync(catalogFile, "utf8")).filter(
  (x) => x.source !== "colorful-original",
);
for (const old of existing)
  if (
    output.some(
      (x) => x.entry.name === old.name || x.entry.component === old.component,
    )
  )
    issues.push(`Existing catalog collision ${old.name}`);
const report = {
  count: output.length,
  uniqueGeometry: hashes.size,
  issues,
  categories: Object.fromEntries(
    [...new Set(output.map((x) => x.entry.category))].map((c) => [
      c,
      output.filter((x) => x.entry.category === c).length,
    ]),
  ),
  icons: output.map((x) => ({ name: x.entry.name, ...x.inspection })),
};
fs.mkdirSync(resolve(root, "design/originals/review"), { recursive: true });
fs.writeFileSync(resolve(root, "design/originals/review/style.json"), JSON.stringify({ count: output.length, issues, icons: output.map(x => ({ name: x.entry.name, ...x.style })) }, null, 2) + "\n");
fs.writeFileSync(
  resolve(root, "design/originals/review/geometry.json"),
  JSON.stringify(report, null, 2) + "\n",
);
if (issues.length)
  throw Error(
    `Original collection rejected before writes:\n${issues.slice(0, 45).join("\n")}\n${issues.length} issues total.`,
  );
const expectedCatalog =
  JSON.stringify([...existing, ...output.map((x) => x.entry)], null, 2) + "\n";
if (check) {
  if (fs.readFileSync(catalogFile, "utf8") !== expectedCatalog)
    throw Error("Original catalog is stale");
  for (const x of output)
    if (
      fs.readFileSync(
        resolve(root, `assets/regular/${x.entry.name}.svg`),
        "utf8",
      ) !== x.source
    )
      throw Error(`Stale original ${x.entry.name}`);
} else {
  for (const x of output)
    fs.writeFileSync(
      resolve(root, `assets/regular/${x.entry.name}.svg`),
      x.source,
    );
  fs.writeFileSync(catalogFile, expectedCatalog);
  const notesFile = resolve(root, "design/redesign/catalog.json");
  const oldNotes = JSON.parse(fs.readFileSync(notesFile, "utf8")).filter(
    (x) => !x.name.startsWith("original-"),
  );
  fs.writeFileSync(
    notesFile,
    JSON.stringify([...oldNotes, ...output.map((x) => x.note)], null, 2) + "\n",
  );
  fs.writeFileSync(
    resolve(root, "design/originals/catalog.json"),
    JSON.stringify(
      output.map((x) => ({ ...x.entry, concept: x.note.visualReason })),
      null,
      2,
    ) + "\n",
  );
}
console.log(
  `${check ? "Verified" : "Registered"} ${output.length} originals, ${hashes.size} unique vector constructions, ${existing.length + output.length} total icons.`,
);
