import { expect, it } from "vitest";
import { morphPaths, shapePath } from "../scripts/morph-geometry";
import { inspectRoundness } from "../scripts/round-svg.mjs";
import { paper } from "../scripts/geometry.mjs";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
const parser = new new JSDOM().window.DOMParser();
it("creates matching path topology, preserves resting geometry and keeps filled silhouettes intact", () => {
  const catalog = JSON.parse(readFileSync("assets/catalog.json", "utf8"));
  let checked = 0;
  for (const { name } of catalog) {
    const svg = parser.parseFromString(
      readFileSync(`assets/regular/${name}.svg`, "utf8"),
      "image/svg+xml",
    );
    for (const part of svg.querySelectorAll(
      "path,rect,circle,ellipse,polygon,polyline",
    )) {
      const fill = part.closest("[fill]")?.getAttribute("fill") ?? "";
      if (!/--project-art-(back|surface)/.test(fill)) continue;
      const source = shapePath(part)!;
      const { rest, target } = morphPaths(
        source,
        fill.includes("back") ? "back" : "surface",
      );
      expect(target.match(/[A-Za-z]/g), name).toEqual(rest.match(/[A-Za-z]/g));
      expect(target, name).not.toBe(rest);
      expect(target, name).not.toMatch(/NaN|Infinity/);
      const rounding = inspectRoundness(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="${target}" fill="red" stroke="none"/></svg>`,
      );
      expect(rounding.issues, name).toEqual([]);
      const a = paper.PathItem.create(source),
        b = paper.PathItem.create(rest),
        c = paper.PathItem.create(target);
      for (const edge of ["left", "top", "right", "bottom"] as const)
        expect(b.bounds[edge], name).toBeCloseTo(a.bounds[edge], 4);
      expect(b.area, name).toBeCloseTo(a.area, 4);
      // Disjoint subpaths can have opposing winding and cancel total area.
      // Check each contour separately, including holes.
      const contours = (item: typeof a) =>
        item instanceof paper.CompoundPath ? item.children : [item];
      const originals = contours(a),
        deformed = contours(c);
      expect(deformed.length, name).toBe(originals.length);
      for (const [i, contour] of originals.entries()) {
        if (Math.abs(contour.area) < 1e-6) continue;
        expect(Math.sign(deformed[i].area), name).toBe(Math.sign(contour.area));
        const ratio = Math.abs(deformed[i].area / contour.area);
        expect(ratio, name).toBeGreaterThan(0.8);
        expect(ratio, name).toBeLessThan(1.2);
      }
      a.remove();
      b.remove();
      c.remove();
      checked++;
    }
  }
  expect(checked).toBeGreaterThan(2000);
}, 20000);
