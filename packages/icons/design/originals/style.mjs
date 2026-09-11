import { JSDOM } from "jsdom";
import { paper } from "../../scripts/geometry.mjs";
import { roundSVG } from "../../scripts/round-svg.mjs";
import { svg } from "./kit.mjs";

const parser = new new JSDOM().window.DOMParser();
export const styleRules = Object.freeze({
  version: "1.1",
  canvas: 24,
  stroke: 1.1,
  fillRadiusMin: 0.55,
  fillRadiusMax: 1.25,
  rectangleRadiusMax: 1.6,
  maxLineLength: 60,
  maxLineContours: 8,
});

// Optical corrections are reviewed per subject, never a universal bounding-box fit.
export const opticalOffsets = {
  "sitting-cat": [1, 0],
  "claw-hammer": [0, -0.7],
  "oyster-knife": [0, 1],
  "paring-knife": [0, 0.7],
  "articulated-bus": [0, -1],
  "articulated-lorry": [0, -0.7],
  "go-kart": [0, -1],
  "quad-bike": [0, -0.7],
  "footrest-ottoman": [0, -0.7],
  "flowering-tea": [0, -0.7],
};

export function styledOriginal(entry) {
  const root = parser.parseFromString(svg(entry.body), "image/svg+xml").documentElement;
  for (const node of root.querySelectorAll('path[stroke="none"]')) {
    const shape = paper.PathItem.create(node.getAttribute("d"));
    const shortSide = Math.min(shape.bounds.width, shape.bounds.height);
    shape.remove();
    // Broad parts need a visible soft corner; small teeth and tips keep their identity.
    const radius = Math.min(styleRules.fillRadiusMax, Math.max(styleRules.fillRadiusMin, shortSide * 0.12));
    node.setAttribute("data-round-radius", radius.toFixed(3));
  }
  for (const node of root.querySelectorAll("rect")) {
    const side = Math.min(+node.getAttribute("width"), +node.getAttribute("height"));
    const radius = Math.min(side / 2, Math.max(+(node.getAttribute("rx") ?? 0), Math.min(styleRules.rectangleRadiusMax, side * 0.25)));
    node.setAttribute("rx", String(radius));
    node.setAttribute("ry", String(radius));
  }
  const offset = opticalOffsets[entry.slug];
  if (offset) {
    const group = root.ownerDocument.createElementNS(root.namespaceURI, "g");
    group.setAttribute("transform", `translate(${offset.join(" ")})`);
    group.append(...root.childNodes);
    root.append(group);
  }
  return roundSVG(root.outerHTML).source;
}

export function inspectStyle(source) {
  const root = parser.parseFromString(source, "image/svg+xml").documentElement;
  let lineLength = 0, lineContours = 0;
  const fills = new Set();
  const issues = [];
  for (const node of root.querySelectorAll("path,rect,circle,ellipse")) {
    const fill = node.getAttribute("fill");
    if (fill && fill !== "none") fills.add(fill.match(/--project-art-(\w+)/)?.[1]);
    if (node.localName !== "path" || fill !== "none") continue;
    const path = paper.PathItem.create(node.getAttribute("d"));
    lineLength += path.length;
    lineContours += path.children?.length ?? 1;
    path.remove();
  }
  if (!fills.has("surface") || !fills.has("back")) issues.push("Both semantic fill layers are required");
  if (lineLength > styleRules.maxLineLength) issues.push(`Dense structural lines: ${lineLength.toFixed(1)} units`);
  if (lineContours > styleRules.maxLineContours) issues.push(`Too many line contours: ${lineContours}`);
  if (root.getAttribute("stroke-width") !== String(styleRules.stroke)) issues.push("Inconsistent regular stroke");
  return { lineLength: +lineLength.toFixed(2), lineContours, fillLayers: [...fills].sort(), issues };
}
