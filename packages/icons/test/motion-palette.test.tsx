import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { IconContext } from "../src/lib/context";
import { palettePresets } from "../src/lib/palette";
import { StoryIcon } from "../src/csr/Story";

afterEach(cleanup);
it("offers eight presets with exactly three colors in both modes", () => {
  expect(Object.keys(palettePresets)).toHaveLength(8);
  for (const preset of Object.values(palettePresets)) {
    for (const theme of ["light", "dark"] as const) {
      expect(Object.keys(preset[theme]).sort()).toEqual([
        "back",
        "detail",
        "surface",
      ]);
      expect(new Set(Object.values(preset[theme])).size).toBe(3);
    }
  }
});
it("inherits a preset and allows three independently overridden colors", () => {
  const { container } = render(
    <IconContext.Provider
      value={{ preset: "mint", theme: "dark", palette: { back: "#112233" } }}
    >
      <StoryIcon palette={{ surface: "#aabbcc", detail: "#445566" }} />
    </IconContext.Provider>,
  );
  const style = container.querySelector("svg")!.style;
  expect(style.getPropertyValue("--project-art-surface")).toBe("#aabbcc");
  expect(style.getPropertyValue("--project-art-back")).toBe("#112233");
  expect(style.getPropertyValue("--project-art-detail")).toBe("#445566");
});
it("keeps mirror, entrance and hover transforms in separate layers", () => {
  const { container, rerender } = render(
    <StoryIcon
      mirrored
      entrance="pop"
      hoverAnimation="wiggle"
      animationKey={1}
      mirrorDuration={420}
    />,
  );
  const mirror = container.querySelector("[data-colorful-mirror]")!;
  const entrance = container.querySelector('[data-colorful-enter="pop"]')!;
  expect(mirror.contains(entrance)).toBe(true);
  expect(
    entrance.querySelector('[data-colorful-hover="wiggle"]'),
  ).not.toBeNull();
  expect((mirror as SVGElement).style.transform).toBe("scaleX(-1)");
  expect(
    container
      .querySelector("svg")!
      .style.getPropertyValue("--colorful-mirror-duration"),
  ).toBe("420ms");
  rerender(
    <StoryIcon
      mirrored={false}
      entrance="pop"
      hoverAnimation="wiggle"
      animationKey={2}
    />,
  );
  expect(container.querySelector("[data-colorful-mirror]")).toBe(mirror);
  expect(container.querySelector("[data-colorful-enter]")).not.toBe(entrance);
  expect((mirror as SVGElement).style.transform).toBe("scaleX(1)");
  expect(container.querySelector("svg")?.getAttribute("entrance")).toBeNull();
});

it("animates separate parts and inherits easing, duration and stagger without leaking SVG props", () => {
  const { container } = render(
    <IconContext.Provider
      value={{
        hoverAnimation: "spread",
        hoverEasing: "spring",
        hoverDuration: 720,
        hoverStagger: 60,
      }}
    >
      <StoryIcon weight="duotone" />
    </IconContext.Provider>,
  );
  const svg = container.querySelector("svg")!;
  const hover = svg.querySelector('[data-colorful-hover="spread"]')!;
  expect(hover.getAttribute("data-colorful-easing")).toBe("spring");
  const parts = [...hover.querySelectorAll("[data-colorful-layer]")];
  expect(parts.map((p) => p.getAttribute("data-colorful-layer"))).toEqual([
    "back",
    "surface",
    "back",
    "detail",
  ]);
  expect(parts.every((p) => p.children.length === 1)).toBe(true);
  expect(svg.style.getPropertyValue("--colorful-hover-duration")).toBe("720ms");
  expect(svg.style.getPropertyValue("--colorful-hover-stagger")).toBe("60ms");
  for (const attr of [
    "hoverAnimation",
    "hoverEasing",
    "hoverDuration",
    "hoverStagger",
  ])
    expect(svg.hasAttribute(attr)).toBe(false);
});
