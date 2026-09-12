import { execFileSync } from "node:child_process";
import fs from "node:fs";
const groups = [
  "core",
  "nature",
  "objects",
  "people-media",
  "symbols-directions",
  "symbols-type",
  "symbols-brands",
  "symbols-functional",
];
for (const group of groups)
  execFileSync(process.execPath, [`design/redesign/${group}.mjs`], {
    stdio: "inherit",
  });
execFileSync(process.execPath, ["scripts/expand-symbols.mjs"], {
  stdio: "inherit",
});
const notes = groups.flatMap((group) => {
  const raw = JSON.parse(
    fs.readFileSync(`design/redesign/notes/${group}.json`),
  );
  return (
    Array.isArray(raw)
      ? raw
      : Object.entries(raw).map(([name, note]) => ({ name, ...note }))
  ).map((note) => ({ ...note, group }));
});
const catalog = JSON.parse(fs.readFileSync("assets/catalog.json"));
const legacyCatalog = catalog.filter(
  (entry) => entry.source !== "colorful-original",
);
const byName = new Map(notes.map((note) => [note.name, note]));
if (
  byName.size !== legacyCatalog.length ||
  notes.length !== legacyCatalog.length
)
  throw Error("Design assignments must cover the catalog exactly once");
for (const entry of legacyCatalog) {
  if (!byName.has(entry.name)) throw Error(`Missing design ${entry.name}`);
  entry.designStatus = "redesigned";
  entry.designFamily = byName.get(entry.name).family;
}
fs.writeFileSync(
  "assets/catalog.json",
  JSON.stringify(catalog, null, 2) + "\n",
);
fs.writeFileSync(
  "design/redesign/catalog.json",
  JSON.stringify(notes, null, 2) + "\n",
);
execFileSync(process.execPath, ["scripts/build-originals.mjs"], {
  stdio: "inherit",
});
console.log(
  `All ${notes.length} icons rebuilt from explicit semantic drawings.`,
);

execFileSync(process.execPath, ["scripts/round-icons.mjs"], {
  stdio: "inherit",
});
