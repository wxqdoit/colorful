import { JSDOM } from "jsdom";
import { roundPath, sharpJoins, CORNER_RADIUS } from "./round-geometry.mjs";
const parser = new new JSDOM().window.DOMParser();
const shapes = "path,rect,circle,ellipse,line,polyline,polygon";
function paint(node, key, fallback) {
  for (let el = node; el; el = el.parentElement) {
    if (el.hasAttribute(key)) return el.getAttribute(key);
  }
  return fallback;
}
function roundedRect(node) {
  const rx = node.getAttribute("rx"),
    ry = node.getAttribute("ry");
  return +(rx ?? ry) > 0 && +(ry ?? rx) > 0;
}
function parse(source) {
  const doc = parser.parseFromString(source, "image/svg+xml");
  if (doc.querySelector("parsererror")) throw Error("Invalid SVG");
  return doc.documentElement;
}
function polygonData(node) {
  const points = node
    .getAttribute("points")
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  return (
    points.reduce(
      (d, n, i) => d + (i % 2 ? " " : i === 0 ? "M" : "L") + n,
      "",
    ) + (node.localName === "polygon" ? "Z" : "")
  );
}
export function inspectRoundness(source) {
  const svg = parse(source),
    issues = [];
  let elements = 0,
    filledPaths = 0;
  for (const node of svg.querySelectorAll(shapes)) {
    elements++;
    if (paint(node, "stroke", "none") !== "none")
      for (const attr of ["stroke-linecap", "stroke-linejoin"])
        if (
          paint(node, attr, attr.endsWith("cap") ? "butt" : "miter") !== "round"
        )
          issues.push({ kind: attr });
    if (node.localName === "rect" && !roundedRect(node))
      issues.push({ kind: "rect" });
    const filled = paint(node, "fill", "black") !== "none";
    if (!filled && paint(node, "stroke", "none") === "none") continue;
    if (["path", "polygon", "polyline"].includes(node.localName)) {
      if (filled) filledPaths++;
      const d =
        node.localName === "path" ? node.getAttribute("d") : polygonData(node);
      issues.push(
        ...sharpJoins(d, filled).map((join) => ({
          kind: filled ? "fill-corner" : "stroke-corner",
          ...join,
        })),
      );
    }
  }
  return { elements, filledPaths, issues };
}
export function roundSVG(source) {
  const svg = parse(source);
  let corners = 0,
    rectangles = 0;
  for (const node of [svg, ...svg.querySelectorAll("*")])
    for (const attr of ["stroke-linecap", "stroke-linejoin"])
      if (node === svg || node.hasAttribute(attr))
        node.setAttribute(attr, "round");
  for (let node of svg.querySelectorAll(shapes)) {
    if (node.localName === "rect") {
      if (!roundedRect(node)) {
        node.setAttribute(
          "rx",
          String(
            Math.min(
              CORNER_RADIUS,
              +node.getAttribute("width") / 2,
              +node.getAttribute("height") / 2,
            ),
          ),
        );
        node.setAttribute("ry", node.getAttribute("rx"));
        rectangles++;
      }
    }
    const filled = paint(node, "fill", "black") !== "none";
    if (!filled && paint(node, "stroke", "none") === "none") continue;
    if (["polygon", "polyline"].includes(node.localName)) {
      const path = svg.ownerDocument.createElementNS(svg.namespaceURI, "path");
      for (const { name, value } of node.attributes)
        if (name !== "points") path.setAttribute(name, value);
      path.setAttribute("d", polygonData(node));
      node.replaceWith(path);
      node = path;
    }
    if (node.localName === "path") {
      const hint = node.getAttribute("data-round-radius");
      const radius =
        hint === null ? (filled ? CORNER_RADIUS : 0.8) : Number(hint);
      if (!Number.isFinite(radius) || radius <= 0)
        throw Error("Round radius must be positive");
      node.removeAttribute("data-round-radius");
      const out = roundPath(node.getAttribute("d"), radius, filled);
      if (out.corners) {
        node.setAttribute("d", out.data);
        corners += out.corners;
      }
    }
  }
  return { source: svg.outerHTML + "\n", corners, rectangles };
}
