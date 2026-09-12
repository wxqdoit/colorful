import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { expect, it } from "vitest";
import * as Icons from "../src/index";
import { iconCatalog } from "../src/catalog";

const parser = new new JSDOM().window.DOMParser();
const shapes = "path,circle,ellipse,rect,line,polyline,polygon";
const renderArtwork = (component: string, weight: string) =>
  parser.parseFromString(
    renderToStaticMarkup(
      createElement(Icons[`${component}Icon` as keyof typeof Icons] as never, {
        weight,
      }),
    ),
    "image/svg+xml",
  ).documentElement;

it("preserves every semantic shape and every detail in fill mode across the full catalog", () => {
  for (const entry of iconCatalog) {
    const regular = [
      ...renderArtwork(entry.component, "regular").querySelectorAll(shapes),
    ];
    const fill = [
      ...renderArtwork(entry.component, "fill").querySelectorAll(shapes),
    ];
    expect(fill.length, entry.name).toBe(regular.length);
    regular.forEach((shape, i) => {
      expect(fill[i].localName, entry.name).toBe(shape.localName);
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
        expect(fill[i].getAttribute(attr), `${entry.name}/${i}/${attr}`).toBe(
          shape.getAttribute(attr),
        );
    });
  }
});

it("derives the four line weights and scales locally tuned detail widths", () => {
  for (const [weight, width] of [
    ["thin", 0.45],
    ["light", 0.75],
    ["regular", 1.1],
    ["bold", 1.8],
  ] as const) {
    const svg = renderArtwork("Story", weight);
    expect(
      +svg.querySelector("g[data-colorful-hover]")!.getAttribute("stroke-width")!,
    ).toBe(width);
    const detail = renderArtwork("Synagogue", weight).querySelector(
      "path[stroke-width]",
    )!;
    expect(+detail.getAttribute("stroke-width")!).toBeCloseTo(
      (0.85 * width) / 1.1,
      4,
    );
  }
});
