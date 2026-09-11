import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import svgpath from "svgpath";
import { paper } from "../../scripts/geometry.mjs";
const parser = new new JSDOM().window.DOMParser();
export function inspectOriginal(source) {
  const doc = parser.parseFromString(source, "image/svg+xml");
  const issues = [];
  if (doc.querySelector("parsererror")) return { issues: ["invalid XML"] };
  const root = doc.documentElement;
  if (root.getAttribute("viewBox") !== "0 0 24 24")
    issues.push("invalid viewBox");
  if (
    /NaN|Infinity|<text|<image|<filter|<use|<mask|<clipPath|\bid=|href=/.test(
      source,
    )
  )
    issues.push("unsupported artwork");
  const tokens = new Set(
    [...source.matchAll(/--project-art-([a-z]+)/g)].map((x) => x[1]),
  );
  if (
    tokens.size < 2 ||
    [...tokens].some((x) => !["surface", "back", "detail"].includes(x))
  )
    issues.push("invalid palette");
  for (const node of [root, ...root.querySelectorAll("*")]) {
    if (
      ![
        "svg",
        "g",
        "path",
        "rect",
        "circle",
        "ellipse",
        "line",
        "polygon",
        "polyline",
      ].includes(node.localName)
    )
      issues.push(`unsupported element: ${node.localName}`);
    for (const attr of node.attributes)
      if (
        /^on|href|^id$|^style$/i.test(attr.name) ||
        /url\s*\(/i.test(attr.value)
      )
        issues.push(`unsupported attribute: ${attr.name}`);
  }
  const paths = [];
  let filled = 0;
  let stroked = 0;
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const el of root.querySelectorAll(
    "path,rect,circle,ellipse,line,polygon,polyline",
  )) {
    const v = (k) => Number(el.getAttribute(k));
    let d = el.getAttribute("d");
    if (el.localName === "rect")
      d = `M${v("x")} ${v("y")}h${v("width")}v${v("height")}h${-v("width")}Z`;
    if (["circle", "ellipse"].includes(el.localName)) {
      const rx = v("rx") || v("r"),
        ry = v("ry") || v("r");
      d = `M${v("cx") - rx} ${v("cy")}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
    }
    if (el.localName === "line")
      d = `M${v("x1")} ${v("y1")}L${v("x2")} ${v("y2")}`;
    if (["polyline", "polygon"].includes(el.localName))
      d =
        "M" +
        el.getAttribute("points") +
        (el.localName === "polygon" ? "Z" : "");
    const chain = [];
    let stroke = null,
      width = null;
    for (let parent = el; parent; parent = parent.parentElement) {
      if (parent.hasAttribute("transform"))
        chain.unshift(parent.getAttribute("transform"));
      stroke ??= parent.getAttribute("stroke");
      width ??= parent.getAttribute("stroke-width");
    }
    if (stroke && stroke !== "none") stroked++;
    const transform = chain.join(" ");
    try {
      const q = svgpath(d).transform(transform).abs();
      if (q.err) throw Error(q.err);
      const path = paper.PathItem.create(q.toString());
      const b = path.bounds;
      const basis = svgpath("M0 0L1 0L0 1").transform(transform).abs();
      basis.toString();
      const [[, x0, y0], [, x1, y1], [, x2, y2]] = basis.segments;
      // Use bold stroke width here so a source passing inspection remains safe in all weights.
      const margin =
        stroke && stroke !== "none"
          ? Math.max(Number(width ?? 1.1), 1.8) / 2
          : 0.275;
      const mx = margin * Math.hypot(x1 - x0, x2 - x0),
        my = margin * Math.hypot(y1 - y0, y2 - y0);
      const bounds = [b.left - mx, b.top - my, b.right + mx, b.bottom + my];
      box[0] = Math.min(box[0], bounds[0]);
      box[1] = Math.min(box[1], bounds[1]);
      box[2] = Math.max(box[2], bounds[2]);
      box[3] = Math.max(box[3], bounds[3]);
      if (bounds[0] < 0 || bounds[1] < 0 || bounds[2] > 24 || bounds[3] > 24)
        issues.push(
          `out of bounds: ${bounds.map((n) => n.toFixed(2)).join(",")}`,
        );
      paths.push(q.round(4).toString());
      path.remove();
      if (el.getAttribute("fill") && el.getAttribute("fill") !== "none")
        filled++;
    } catch (error) {
      issues.push(`invalid geometry: ${error.message}`);
    }
  }
  if (!filled) issues.push("missing filled subject");
  if (!stroked) issues.push("missing structural stroke for weight contrast");
  const geometryHash = createHash("sha256")
    .update(paths.sort().join("|"))
    .digest("hex");
  return {
    issues,
    geometryHash,
    shapes: paths.length,
    filled,
    bounds: box.map((n) => +n.toFixed(3)),
  };
}
