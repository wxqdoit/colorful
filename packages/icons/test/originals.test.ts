import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
const catalog = JSON.parse(readFileSync("assets/catalog.json", "utf8"));
const originals = catalog.filter(
  (entry: { source?: string }) => entry.source === "colorful-original",
);
it("adds exactly one thousand separately named originals while retaining the legacy collection", () => {
  expect(originals).toHaveLength(1000);
  expect(catalog).toHaveLength(2519);
  expect(
    new Set(originals.map((entry: { name: string }) => entry.name)).size,
  ).toBe(1000);
  const manifest = JSON.parse(
    readFileSync("design/originals/catalog.json", "utf8"),
  );
  expect(manifest.map((entry: { name: string }) => entry.name)).toEqual(
    originals.map((entry: { name: string }) => entry.name),
  );
  for (const entry of manifest) {
    expect(entry.concept.length, entry.name).toBeGreaterThan(5);
    expect(entry.collection).toBe("originals");
    expect(entry.designStatus).toBe("original");
    expect(entry.component).toMatch(/^Original[A-Z]/);
  }
});
