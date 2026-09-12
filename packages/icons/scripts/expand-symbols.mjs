import fs from "node:fs";
const groups = [
  "symbols-directions",
  "symbols-type",
  "symbols-brands",
  "symbols-functional",
];
const upstream = JSON.parse(fs.readFileSync("vendor/phosphor/catalog.json"));
const source = new Map(upstream.map((x) => [x.name, x]));
const catalog = JSON.parse(fs.readFileSync("assets/catalog.json"));
const byName = new Map(catalog.map((x) => [x.name, x]));
let count = 0;
for (const group of groups) {
  const assignment = JSON.parse(
    fs.readFileSync(`design/redesign/assignments/${group}.json`),
  );
  const raw = JSON.parse(
    fs.readFileSync(`design/redesign/notes/${group}.json`),
  );
  const notes = new Map(
    (Array.isArray(raw) ? raw : Object.values(raw)).map((x) => [x.name, x]),
  );
  for (const { name } of assignment) {
    const ref = source.get(name),
      note = notes.get(name);
    if (!ref || !note || !fs.existsSync(`assets/regular/${name}.svg`))
      throw Error(`Incomplete new icon ${name}`);
    const entry = {
      name,
      source: "phosphor",
      component: ref.pascal_name,
      label: note.label || ref.pascal_name.replace(/([a-z])([A-Z])/g, "$1 $2"),
      category:
        note.category ||
        {
          "symbols-directions": "方向与布局",
          "symbols-type": "文字与运算",
          "symbols-brands": "品牌标识",
          "symbols-functional": "功能符号",
        }[group],
      tags: [
        ...new Set([
          ...ref.tags,
          ...ref.categories,
          "新增符号",
          "functional-symbol",
          note.family,
        ]),
      ],
      designStatus: "redesigned",
      designFamily: note.family,
    };
    if (byName.has(name)) Object.assign(byName.get(name), entry);
    else {
      catalog.push(entry);
      byName.set(name, entry);
    }
    count++;
  }
}
if (
  count !== 466 ||
  catalog.filter((entry) => entry.source !== "colorful-original").length !==
    1519
)
  throw Error(`Unexpected expansion count ${count}/${catalog.length}`);
for (const ref of upstream)
  if (!byName.has(ref.name))
    throw Error(`Missing upstream meaning ${ref.name}`);
fs.writeFileSync(
  "assets/catalog.json",
  JSON.stringify(catalog, null, 2) + "\n",
);
const coveragePath = "docs/catalog/phosphor-coverage.json";
const historicalPath = "docs/catalog/phosphor-coverage-0.2.0.json";
if (!fs.existsSync(historicalPath))
  fs.copyFileSync(coveragePath, historicalPath);
const previous = JSON.parse(fs.readFileSync(historicalPath));
const coverage = {
  summary: {
    reactRevision: previous.summary.reactRevision,
    coreRevision: previous.summary.coreRevision,
    version: "0.6.0",
    reviewed: 1512,
    redesigned: 1512,
    excluded: 0,
    addedSymbols: 466,
    projectSpecific: 7,
    total: 1519,
  },
  icons: previous.icons.map((icon) => ({
    name: icon.name,
    status: "redesigned",
    previousStatus: icon.status,
    component: byName.get(icon.name).component,
    designFamily: byName.get(icon.name).designFamily,
    reason:
      icon.status === "excluded"
        ? "功能符号与品牌按圆润设计语言补绘，保留语义，不强制堆叠色块"
        : "已按物件族重新绘制",
    sourceCategories: source.get(icon.name).categories,
  })),
};
fs.writeFileSync(coveragePath, JSON.stringify(coverage, null, 2) + "\n");
console.log(
  `Integrated ${count} new symbols: ${catalog.length} total, all ${upstream.length} upstream meanings covered.`,
);
