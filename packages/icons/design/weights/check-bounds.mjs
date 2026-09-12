import fs from "node:fs";
import { JSDOM } from "jsdom";
import svgpath from "svgpath";
import { paper } from "../../scripts/geometry.mjs";
import { deriveVariant } from "../../scripts/derive-svg.mjs";
const parser = new new JSDOM().window.DOMParser();
const names = JSON.parse(fs.readFileSync("assets/catalog.json"));
let failures = [];
for (const weight of ["thin", "light", "regular", "bold", "fill", "duotone"])
  for (const { name } of names) {
    const regular = fs.readFileSync(`assets/regular/${name}.svg`, "utf8");
    const svg = parser.parseFromString(
      weight === "regular" ? regular : deriveVariant(regular, weight),
      "image/svg+xml",
    ).documentElement;
    for (const el of svg.querySelectorAll(
      "path,rect,circle,ellipse,line,polygon,polyline",
    )) {
      const v = (k) => +el.getAttribute(k);
      let d = el.getAttribute("d");
      switch (el.localName) {
        case "rect":
          d = `M${v("x")} ${v("y")}h${v("width")}v${v("height")}h${-v("width")}Z`;
          break;
        case "circle":
        case "ellipse": {
          const x = v("cx"),
            y = v("cy"),
            rx = v("rx") || v("r"),
            ry = v("ry") || v("r");
          d = `M${x - rx} ${y}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
          break;
        }
        case "line":
          d = `M${v("x1")} ${v("y1")}L${v("x2")} ${v("y2")}`;
          break;
        case "polyline":
        case "polygon":
          d =
            "M" +
            el.getAttribute("points") +
            (el.localName === "polygon" ? "Z" : "");
      }
      const chain = [];
      let stroke = null,
        width = null;
      for (let p = el; p; p = p.parentElement) {
        if (p.hasAttribute("transform"))
          chain.unshift(p.getAttribute("transform"));
        stroke ??= p.getAttribute("stroke");
        width ??= p.getAttribute("stroke-width");
      }
      const transform = chain.join(" ");
      const p = paper.PathItem.create(
        svgpath(d).transform(transform).toString(),
      );
      const b = p.bounds;
      const basis = svgpath("M0 0L1 0L0 1").transform(transform).abs();
      basis.toString();
      const [[, x0, y0], [, x1, y1], [, x2, y2]] = basis.segments;
      const m = stroke && stroke !== "none" ? Number(width ?? 1) / 2 : 0;
      const mx = m * Math.hypot(x1 - x0, x2 - x0),
        my = m * Math.hypot(y1 - y0, y2 - y0);
      const box = [b.left - mx, b.top - my, b.right + mx, b.bottom + my];
      if (box[0] < -0.01 || box[1] < -0.01 || box[2] > 24.01 || box[3] > 24.01)
        failures.push({ name, weight, box });
      p.remove();
    }
  }
console.log(JSON.stringify({ checked: names.length * 6, failures }, null, 2));
if (failures.length) process.exitCode = 1;
