import { palettes, type IconTheme, type IconPalette } from "@colorful-icons/react/lib";

/** Resolve the three scoped CSS tokens so downloaded SVGs work outside this page. */
export function standaloneSVG(
  source: SVGSVGElement,
  theme: IconTheme,
  palette?: IconPalette,
): string {
  const copy = source.cloneNode(true) as SVGSVGElement;
  const colors = { ...palettes[theme], ...palette };
  const resolveColor = (value: string) =>
    value.replace(
      /var\(--project-art-(\w+),\s*([^)]+)\)/g,
      (_, key: keyof typeof colors, fallback: string) =>
        colors[key] ?? fallback,
    );
  for (const element of [copy, ...copy.querySelectorAll("*")]) {
    for (const attribute of [...element.attributes]) {
      if (attribute.value.includes("var("))
        element.setAttribute(attribute.name, resolveColor(attribute.value));
    }
  }
  copy.removeAttribute("style");
  for (const group of copy.querySelectorAll<SVGElement>("g")) {
    if (
      group.hasAttribute("data-colorful-mirror") &&
      group.style.transform === "scaleX(-1)"
    )
      group.setAttribute("transform", "translate(24 0) scale(-1 1)");
    group.removeAttribute("style");
    for (const attribute of [...group.attributes])
      if (attribute.name.startsWith("data-colorful"))
        group.removeAttribute(attribute.name);
  }
  // React sets xmlns as an ordinary attribute. Let the XML serializer emit the
  // namespace from namespaceURI, preventing a duplicate xmlns in DOM serializers.
  copy.removeAttribute("xmlns");
  return new XMLSerializer().serializeToString(copy);
}

export function downloadSVG(svg: string, filename: string) {
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
