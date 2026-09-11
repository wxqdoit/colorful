import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { expect, it } from "vitest";
const parser = new new JSDOM().window.DOMParser();
const catalog = JSON.parse(readFileSync("assets/catalog.json", "utf8"));
const artwork = (name: string, weight: string) =>
  parser.parseFromString(
    readFileSync(`assets/${weight}/${name}.svg`, "utf8"),
    "image/svg+xml",
  ).documentElement;
const shapes = "path,circle,ellipse,rect,line,polyline,polygon";
it("preserves every semantic shape and every detail in fill mode across the full catalog", () => {
  for (const { name } of catalog) {
    const source = [...artwork(name, "regular").querySelectorAll(shapes)];
    const fill = [...artwork(name, "fill").querySelectorAll(shapes)];
    expect(fill.length, name).toBe(source.length);
    source.forEach((shape, i) => {
      expect(fill[i].localName, name).toBe(shape.localName);
      for (const attr of [
        "d",
        "cx",
        "cy",
        "r",
        "rx",
        "ry",
        "x",
        "y",
        "width",
        "height",
        "points",
      ])
        expect(fill[i].getAttribute(attr), `${name}/${i}/${attr}`).toBe(
          shape.getAttribute(attr),
        );
    });
  }
});
it("separates the four line weights and scales locally tuned detail widths", () => {
  for (const [weight, width] of [
    ["thin", 0.45],
    ["light", 0.75],
    ["regular", 1.1],
    ["bold", 1.8],
  ] as const) {
    expect(+artwork("story", weight).getAttribute("stroke-width")!).toBe(width);
    const detail = artwork("synagogue", weight).querySelector(
      "path[stroke-width]",
    )!;
    expect(+detail.getAttribute("stroke-width")!).toBeCloseTo(
      (0.85 * width) / 1.1,
      4,
    );
  }
});
