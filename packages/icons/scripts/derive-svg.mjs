import { JSDOM } from "jsdom";

const parser = new new JSDOM().window.DOMParser();
const widths = {
  thin: "0.45",
  light: "0.75",
  regular: "1.1",
  bold: "1.8",
  fill: "1.1",
  duotone: "1.1",
};

/** Build a static SVG variant without writing it to the package assets. */
export function deriveVariant(source, weight) {
  const document = parser.parseFromString(source, "image/svg+xml");
  const svg = document.documentElement;
  svg.setAttribute("stroke-width", widths[weight]);
  for (const node of svg.querySelectorAll("[stroke-width]")) {
    const localWidth = Number(node.getAttribute("stroke-width"));
    if (Number.isFinite(localWidth))
      node.setAttribute(
        "stroke-width",
        String(Number(((localWidth * Number(widths[weight])) / 1.1).toFixed(6))),
      );
  }
  for (const shape of svg.querySelectorAll(
    "path,circle,ellipse,rect,line,polyline,polygon",
  )) {
    const fill = shape.getAttribute("fill");
    if (
      weight === "fill" &&
      fill &&
      fill !== "none" &&
      shape.getAttribute("stroke") === "none"
    ) {
      shape.setAttribute("stroke", fill);
      shape.setAttribute(
        "stroke-width",
        fill.includes("--project-art-detail") ? "0.2" : "0.55",
      );
    }
    if (
      weight === "duotone" &&
      fill &&
      !fill.includes("--project-art-surface") &&
      fill !== "none"
    )
      shape.setAttribute("fill", "var(--project-art-detail, #aa8bcf)");
  }
  return `${svg.outerHTML}\n`;
}

