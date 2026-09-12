import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { StoryIcon } from "@colorful-icons/react/Story";
import { WatercolorIcon } from "@colorful-icons/react/Watercolor";
import { standaloneSVG } from "../src/export";

afterEach(cleanup);
it("exports a self-contained dark SVG with its chosen dimensions and mirror", () => {
  const { container } = render(
    <WatercolorIcon
      size={48}
      theme="dark"
      mirrored
      weight="bold"
      alt="Watercolor"
    />,
  );
  const original = container.querySelector("svg")!;
  const exported = standaloneSVG(original, "dark");
  const document = new DOMParser().parseFromString(exported, "image/svg+xml");
  expect(document.querySelector("parsererror")).toBeNull();
  expect(exported).not.toContain("var(");
  expect(exported).toContain("#746188");
  expect(exported).toContain("#af94ca");
  expect(exported).toContain("#efdcfa");
  expect(document.documentElement.getAttribute("width")).toBe("48");
  expect(
    document.querySelector("g[transform]")?.getAttribute("transform"),
  ).toBe("translate(24 0) scale(-1 1)");
  expect(
    document.querySelector("g[stroke-width]")?.getAttribute("stroke-width"),
  ).toBe("1.8");
  expect(document.querySelector("title")?.textContent).toBe("Watercolor");
  expect(original.outerHTML).toContain("var(");
});

it("exports fill artwork with its complete structure and same-color fuller edges", () => {
  const { container } = render(<StoryIcon weight="fill" />);
  const original = container.querySelector("svg")!;
  const exported = standaloneSVG(original, "light");
  const document = new DOMParser().parseFromString(exported, "image/svg+xml");
  expect(document.querySelector("parsererror")).toBeNull();
  expect(
    [...document.querySelectorAll("path")].map((path) =>
      path.getAttribute("d"),
    ),
  ).toEqual(
    [...original.querySelectorAll("path")].map((path) =>
      path.getAttribute("d"),
    ),
  );
  const detail = document.querySelector('path[fill="none"]');
  expect(detail).not.toBeNull();
  expect(detail!.closest("[stroke]")?.getAttribute("stroke")).toBe("#aa8bcf");
  for (const shape of document.querySelectorAll('path:not([fill="none"])'))
    expect(shape.getAttribute("stroke")).toBe(shape.getAttribute("fill"));
  expect(exported).toContain("#f0e9f8");
  expect(exported).not.toContain("--project-art");
});

it("bakes a custom three-color palette into an animation-free static export", () => {
  const palette = { surface: "#ffeedd", back: "#ddaa88", detail: "#885533" };
  const { container } = render(
    <WatercolorIcon
      palette={palette}
      entrance="rise"
      hoverAnimation="wiggle"
    />,
  );
  const svg = standaloneSVG(container.querySelector("svg")!, "light", palette);
  for (const color of Object.values(palette)) expect(svg).toContain(color);
  expect(svg).not.toContain("data-colorful-enter");
  expect(svg).not.toContain("data-colorful-layer");
  expect(svg).not.toContain("data-colorful-easing");
  expect(svg).not.toContain("animation");
});
