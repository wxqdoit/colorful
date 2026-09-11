import { expect, it } from "vitest";
import { roundPath, sharpJoins } from "../scripts/round-geometry.mjs";
import { paper } from "../scripts/geometry.mjs";
it("rounds filled corners at line/curve joints, concave notches and closed seams", () => {
  for (const d of [
    "M2 2H22V22H2Z",
    "M2 10C2 1 22 1 22 10Z",
    "M2 2H22V22H14V12H10V22H2Z",
    "M3 3L21 12L3 21Z",
    "M2 2L22 2L22 22L2 22",
  ]) {
    expect(sharpJoins(d).length).toBeGreaterThan(0);
    const rounded = roundPath(d);
    expect(rounded.corners).toBeGreaterThan(0);
    expect(sharpJoins(rounded.data), d).toEqual([]);
    const before = paper.PathItem.create(d),
      after = paper.PathItem.create(rounded.data);
    expect(Math.abs(after.area / before.area), d).toBeGreaterThan(0.9);
    before.remove();
    after.remove();
  }
});
it("preserves compound holes and leaves already smooth curves unchanged", () => {
  const d = "M2 2H22V22H2Z M6 6V18H18V6Z";
  const out = roundPath(d).data;
  expect(sharpJoins(out)).toEqual([]);
  expect(roundPath(out).data).toBe(out);
  const shape = paper.PathItem.create(out);
  expect(shape.contains([12, 12])).toBe(false);
  shape.remove();
  const circle = "M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z";
  expect(roundPath(circle).data).toBe(circle);
});
it("rounds stroke centerlines without closing open lines or connecting separate marks", () => {
  const line = "M2 9V2H9 M12 12L18 5L22 12";
  const out = roundPath(line, 0.8, false);
  expect(sharpJoins(out.data, false)).toEqual([]);
  expect(out.data).not.toMatch(/z/i);
  const p = paper.PathItem.create(out.data);
  expect(p.children).toHaveLength(2);
  p.remove();
  expect(roundPath(out.data, 0.8, false).data).toBe(out.data);
  const plain = "M2 2L22 2";
  expect(roundPath(plain, 0.8, false).data).toBe(plain);
});
it("rounds inherited fills, stroked geometry and explicit zero rectangle radii in actual SVG", async () => {
  const { roundSVG, inspectRoundness } =
    await import("../scripts/round-svg.mjs");
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="purple"><g fill="pink"><path d="M2 2H8V8H2Z"/></g><path d="M12 3V9H20" stroke-linejoin="miter"/><rect x="2" y="12" width="5" height="6" rx="0" ry="2"/></svg>';
  expect(inspectRoundness(svg).issues.length).toBeGreaterThan(0);
  const output = roundSVG(svg).source;
  expect(inspectRoundness(output).issues).toEqual([]);
  expect(roundSVG(output).source).toBe(output);
  expect(output).toContain('fill="pink"');
  expect(output).toContain('rx="0.65" ry="0.65"');
});
