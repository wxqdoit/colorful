import { JSDOM } from "jsdom";
import { shapePath, morphPaths } from "./morph-geometry";
const parser = new new JSDOM().window.DOMParser();
const shapes = "path,circle,ellipse,rect,line,polyline,polygon";

/** Wrap parts in place: paint order, holes and authored transforms stay intact. */
export function withMotionLayers(
  svgText: string,
  regularSource: string,
  options: { morph?: boolean } = {},
) {
  const includeMorph = options.morph !== false;
  const document = parser.parseFromString(svgText, "image/svg+xml");
  const reference = parser.parseFromString(regularSource, "image/svg+xml");
  const originals = [...reference.querySelectorAll(shapes)];
  for (const [index, part] of [
    ...document.querySelectorAll(shapes),
  ].entries()) {
    const original = originals[index] ?? part;
    const fill = original.closest("[fill]")?.getAttribute("fill") ?? "none";
    // Functional glyphs use colored strokes as meaningful parts too.
    // Classify their paint role without turning an open stroke into a filled morph.
    const paint =
      fill === "none"
        ? (original.closest("[stroke]")?.getAttribute("stroke") ?? "none")
        : fill;
    const role = paint.includes("--project-art-back")
      ? "back"
      : paint.includes("--project-art-surface")
        ? "surface"
        : "detail";
    const layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.setAttribute("data-colorful-layer", role);
    layer.setAttribute("data-colorful-part", String(index % 3));
    part.parentNode!.insertBefore(layer, part);
    layer.appendChild(part);
    if (includeMorph && role !== "detail" && fill !== "none") {
      const d = shapePath(part);
      if (d) {
        const pair = morphPaths(d, role);
        layer.setAttribute("data-colorful-morph", "");
        layer.setAttribute(
          "style",
          `--colorful-shape-rest: path('${pair.rest}'); --colorful-shape-target: path('${pair.target}');`,
        );
        if (part.localName !== "path") {
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          for (const attr of part.attributes)
            if (!/^(x|y|width|height|rx|ry|cx|cy|r|points)$/.test(attr.name))
              path.setAttribute(attr.name, attr.value);
          path.setAttribute("d", d);
          part.replaceWith(path);
        }
      }
    }
  }
  return document.documentElement.outerHTML;
}
