import { expect, it } from "vitest";
import { shapePath } from "../scripts/morph-geometry";
import { withMotionLayers } from "../scripts/motion-layers";
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
const parser = new new JSDOM().window.DOMParser();
it("preserves authored transforms, geometry and paint order when wrapping every catalog part", () => {
  const catalog = JSON.parse(readFileSync("assets/catalog.json", "utf8"));
  for (const { name } of catalog) {
    const source = readFileSync(`assets/regular/${name}.svg`, "utf8");
    const original = parser.parseFromString(source, "image/svg+xml");
    const wrapped = parser.parseFromString(
      withMotionLayers(source, source),
      "image/svg+xml",
    );
    const selector = "path,circle,ellipse,rect,line,polyline,polygon";
    const parts = [...wrapped.querySelectorAll(selector)];
    const originals = [...original.querySelectorAll(selector)];
    expect(parts.length, name).toBe(originals.length);
    const transforms = (p: Element) => {
      const chain = [];
      for (let node: Element | null = p; node; node = node.parentElement)
        if (node.hasAttribute("transform"))
          chain.unshift(node.getAttribute("transform"));
      return chain;
    };
    for (const [i, part] of parts.entries()) {
      const ref = originals[i];
      expect(
        part.parentElement!.hasAttribute("data-colorful-layer"),
        name,
      ).toBe(true);
      if (part.parentElement!.hasAttribute("data-colorful-morph"))
        expect(part.getAttribute("d"), name).toBe(shapePath(ref));
      else expect(part.outerHTML, name).toBe(ref.outerHTML);
      expect(transforms(part), name).toEqual(transforms(ref));
      for (const attr of [
        "fill",
        "stroke",
        "stroke-width",
        "opacity",
        "fill-rule",
      ])
        expect(part.getAttribute(attr), name).toBe(ref.getAttribute(attr));
    }
  }
});

it("animates open colored glyph strokes as separate paint layers without filling or morphing them", () => {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--project-art-detail, #aa8bcf)"><g stroke="var(--project-art-back, #d9c9ed)"><path d="M4 12H20"/></g><path d="M12 4V20"/></svg>`;
  const svg = parser.parseFromString(
    withMotionLayers(source, source),
    "image/svg+xml",
  );
  expect(
    [...svg.querySelectorAll("[data-colorful-layer]")].map((n) =>
      n.getAttribute("data-colorful-layer"),
    ),
  ).toEqual(["back", "detail"]);
  expect(svg.querySelector("[data-colorful-morph]")).toBeNull();
  expect(
    [...svg.querySelectorAll("path")].map((n) => n.getAttribute("d")),
  ).toEqual(["M4 12H20", "M12 4V20"]);
});

it("supports compact runtime layers without embedding duplicate morph geometry", () => {
  const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="var(--project-art-surface, #f0e9f8)" stroke="none" d="M4 4h16v16H4z"/></svg>`;
  const svg = parser.parseFromString(
    withMotionLayers(source, source, { morph: false }),
    "image/svg+xml",
  );
  const layer = svg.querySelector("[data-colorful-layer]")!;
  expect(layer.hasAttribute("data-colorful-morph")).toBe(false);
  expect(layer.querySelector("path")!.getAttribute("d")).toBe("M4 4h16v16H4z");
});
