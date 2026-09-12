import { existsSync, readFileSync } from "node:fs";
import { expect, it } from "vitest";
const catalog = JSON.parse(readFileSync("assets/catalog.json", "utf8"));
const coverage = JSON.parse(
  readFileSync("docs/catalog/phosphor-coverage.json", "utf8"),
);
it("includes every upstream meaning with no excluded icons", () => {
  const upstream = JSON.parse(
    readFileSync("vendor/phosphor/catalog.json", "utf8"),
  );
  expect(new Set(coverage.icons.map((i: { name: string }) => i.name))).toEqual(
    new Set(upstream.map((i: { name: string }) => i.name)),
  );
  expect(coverage.icons).toHaveLength(upstream.length);
  for (const icon of coverage.icons) {
    expect(icon.reason.length).toBeGreaterThan(5);
    expect(icon.status, icon.name).toBe("redesigned");
    expect(
      catalog.some(
        (c: { name: string; component: string }) =>
          c.name === icon.name && c.component === icon.component,
      ),
      icon.name,
    ).toBe(true);
  }
  expect(coverage.summary.excluded).toBe(0);
  expect(coverage.summary.redesigned).toBe(upstream.length);
  expect(
    catalog.filter(
      (entry: { source?: string }) => entry.source !== "colorful-original",
    ),
  ).toHaveLength(upstream.length + coverage.summary.projectSpecific);
  const historical = JSON.parse(
    readFileSync("docs/catalog/phosphor-coverage-0.2.0.json", "utf8"),
  );
  const formerlyExcluded = historical.icons.filter(
    (i: { status: string }) => i.status === "excluded",
  );
  expect(formerlyExcluded).toHaveLength(coverage.summary.addedSymbols);
  for (const { name } of formerlyExcluded)
    expect(
      catalog.some((c: { name: string }) => c.name === name),
      name,
    ).toBe(true);
});
it("uses only three semantic ink colors across all source artwork", () => {
  for (const icon of catalog) {
    const svg = readFileSync(`assets/regular/${icon.name}.svg`, "utf8");
    const tokens = [...svg.matchAll(/--project-art-([a-z]+)/g)].map(
      (m) => m[1],
    );
    expect(tokens.length, icon.name).toBeGreaterThan(1);
    expect(
      tokens.every((t) => ["surface", "back", "detail"].includes(t)),
      icon.name,
    ).toBe(true);
    expect(svg, icon.name).not.toMatch(/NaN|Infinity|<image|<filter/);
  }
});
it("replaces every old draft and records a design decision for every icon", () => {
  const notes = JSON.parse(
    readFileSync("design/redesign/catalog.json", "utf8"),
  );
  expect(notes).toHaveLength(catalog.length);
  expect(new Set(notes.map((n: { name: string }) => n.name))).toEqual(
    new Set(catalog.map((n: { name: string }) => n.name)),
  );
  for (const icon of catalog) {
    expect(icon.designStatus, icon.name).toBe(
      icon.source === "colorful-original" ? "original" : "redesigned",
    );
    const note = notes.find((n: { name: string }) => n.name === icon.name);
    expect(note.visualReason.length, icon.name).toBeGreaterThan(5);
    if (icon.source === "colorful-original") continue;
    const archived = `design/archive/0.2.0-regular/${icon.name}.svg`;
    expect(
      readFileSync(`assets/regular/${icon.name}.svg`, "utf8"),
      icon.name,
    ).not.toBe(
      readFileSync(
        existsSync(archived)
          ? archived
          : `vendor/phosphor/raw/${icon.name}.svg`,
        "utf8",
      ),
    );
  }
});
