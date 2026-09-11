import { expect, it } from "vitest";
import { inspectStyle, styledOriginal } from "../design/originals/style.mjs";

const fills = '<rect x="3" y="3" width="18" height="18" rx=".2" fill="var(--project-art-surface, #f0e9f8)" stroke="none"/><circle cx="12" cy="12" r="4" fill="var(--project-art-back, #d9c9ed)" stroke="none"/>';
it("softens broad panels while preserving small parts and semantic layers", () => {
  const source = styledOriginal({slug: "sample", body: fills + '<path d="M9 12h6" fill="none"/>'});
  expect(source).toContain('rx="1.6"');
  expect(inspectStyle(source).issues).toEqual([]);
  expect(inspectStyle(source).fillLayers).toEqual(["back", "surface"]);
});
it("rejects dense linework and missing semantic fill layers", () => {
  const dense = styledOriginal({slug: "sample", body: fills + `<path d="${Array.from({length: 10}, (_, i) => `M3 ${3 + i}H21`).join("")}" fill="none"/>`});
  expect(inspectStyle(dense).issues).toHaveLength(2);
  expect(inspectStyle(styledOriginal({slug: "sample",body:'<path d="M3 3h18" fill="none"/>'})).issues).toContain("Both semantic fill layers are required");
});
it("keeps optical offsets subject-specific and preserves regular line width", () => {
  const cat = styledOriginal({slug:"sitting-cat",body:fills});
  const other = styledOriginal({slug:"sample",body:fills});
  expect(cat).toContain('transform="translate(1 0)"');
  expect(other).not.toContain('transform=');
  expect(cat).toContain('stroke-width="1.1"');
});
