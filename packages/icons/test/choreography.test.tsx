import { expect, it, vi, afterEach } from "vitest";
import { attachLayerMotion } from "../src/lib/useLayerMotion";
import {
  contourFrames,
  transformFrames,
  beats,
  motionEasings,
} from "../src/lib/choreography";
import { render, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { StoryIcon } from "../src/csr/Story";

afterEach(() => {
  cleanup();
  delete (Element.prototype as any).animate;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});
it("gives each gesture anticipation, an overshoot, diminishing recoil and an exact resting finish", () => {
  const firstPoses = new Set();
  for (const mode of ["lift", "wiggle", "pulse", "spread", "morph"] as const) {
    for (const role of ["back", "surface", "detail"]) {
      const frames = transformFrames(mode, role, motionEasings.spring);
      expect(frames.map((f) => f.offset)).toEqual(beats);
      expect(frames[frames.length - 1]?.transform).toBe(frames[0].transform);
      expect(frames[1].transform).not.toBe(frames[2].transform);
      firstPoses.add(frames[2].transform);
    }
  }
  expect(firstPoses.size).toBeGreaterThan(8);
  const shapes = contourFrames(
    'path("M0 0C1 1 2 2 3 3Z")',
    'path("M0 0C2 1 3 2 4 3Z")',
    motionEasings.spring,
  );
  expect(shapes[0].d).toBe(shapes[shapes.length - 1]?.d);
  expect(shapes[1].d).toContain("1.12");
  expect(shapes[2].d).toContain("4 3");
  expect(shapes[3].d).not.toBe(shapes[2].d);
});
it("animates child layers, settles interruptions and releases listeners and effects", () => {
  const calls: {
    target: Element;
    frames: Keyframe[];
    options: KeyframeAnimationOptions;
    animation: any;
  }[] = [];
  const animate = vi.fn(function (
    this: Element,
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    const animation = { cancel: vi.fn(), onfinish: null };
    calls.push({ target: this, frames, options, animation });
    return animation;
  });
  vi.stubGlobal("CSS", { supports: () => true });
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    writable: true,
    value: animate,
  });
  document.body.innerHTML =
    '<button data-colorful-hover-target><svg style="--colorful-motion-enabled:1"><g data-colorful-hover="wiggle"><g data-colorful-layer="back" data-colorful-part="0"><path d="M0 0L2 2"/></g><g data-colorful-layer="detail" data-colorful-part="1"><path d="M1 1L3 3"/></g></g></svg></button>';
  const svg = document.querySelector("svg")!;
  const host = document.querySelector("button")!;
  const controller = attachLayerMotion(svg, {
    hoverAnimation: "wiggle",
    hoverDuration: 900,
    hoverStagger: 65,
  });
  host.dispatchEvent(new Event("pointerenter"));
  expect(calls.length).toBe(2);
  expect(calls.every((c) => c.target.hasAttribute("data-colorful-layer"))).toBe(
    true,
  );
  expect(calls[1].options.delay).toBeGreaterThan(
    calls[0].options.delay! as number,
  );
  host.dispatchEvent(new Event("pointerleave"));
  expect(calls.length).toBe(4);
  expect(calls[0].animation.cancel).toHaveBeenCalled();
  expect(calls[2].frames.length).toBe(2);
  expect(calls[2].options.duration).toBe(320);
  controller.destroy();
  host.dispatchEvent(new Event("pointerenter"));
  expect(calls.length).toBe(4);
  expect(calls[3].animation.cancel).toHaveBeenCalled();
  expect(svg.querySelector("[data-colorful-motion-managed]")).toBeNull();
});
it("keeps the public SVG ref stable when replaying choreography", () => {
  const ref = createRef<SVGSVGElement>();
  const { rerender } = render(
    <StoryIcon ref={ref} hoverAnimation="morph" hoverReplayKey={0} />,
  );
  const svg = ref.current;
  rerender(<StoryIcon ref={ref} hoverAnimation="morph" hoverReplayKey={1} />);
  expect(ref.current).toBe(svg);
  expect(svg?.hasAttribute("hoverReplayKey")).toBe(false);
});
