import { useEffect, useRef, type RefObject } from "react";
import type { IconBaseProps } from "./types";
import { contourFrames, motionEasings, transformFrames } from "./choreography";

type MotionOptions = Pick<
  IconBaseProps,
  "hoverAnimation" | "hoverEasing" | "hoverDuration" | "hoverStagger"
>;
/** Own only our animations; never cancel mirror, entrance, or caller effects. */
export function attachLayerMotion(svg: SVGSVGElement, options: MotionOptions) {
  const scope = svg.querySelector<SVGGElement>("[data-colorful-hover]");
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!scope || typeof svg.animate !== "function")
    return { play: () => {}, destroy: () => {} };
  const host = svg.closest<HTMLElement>("[data-colorful-hover-target]") ?? svg;
  const mode = options.hoverAnimation ?? "none";
  const duration = Math.max(0, options.hoverDuration ?? 900);
  const stagger = Math.max(0, options.hoverStagger ?? 65);
  const easing = motionEasings[options.hoverEasing ?? "spring"];
  const active = new Map<
    Element,
    { animation: Animation; property: "d" | "transform"; rest: string }
  >();
  let entered = false;
  scope.setAttribute("data-colorful-motion-managed", "");
  const clear = () => {
    for (const { animation } of active.values()) {
      animation.onfinish = null;
      animation.cancel();
    }
    active.clear();
  };
  function run(
    element: Element,
    frames: Keyframe[],
    property: "d" | "transform",
    rest: string,
    delay = 0,
    ms = duration,
  ) {
    const old = active.get(element);
    const from = old
      ? getComputedStyle(element).getPropertyValue(property)
      : null;
    if (old) {
      old.animation.onfinish = null;
      old.animation.cancel();
    }
    if (from) frames[0] = { ...frames[0], [property]: from };
    const animation = element.animate(frames, {
      duration: ms,
      delay,
      fill: "both",
      easing: "linear",
    });
    active.set(element, { animation, property, rest });
    animation.onfinish = () => {
      if (active.get(element)?.animation === animation) {
        active.delete(element);
        animation.cancel();
      }
    };
  }
  function play() {
    if (
      mode === "none" ||
      !duration ||
      media?.matches ||
      getComputedStyle(svg)
        .getPropertyValue("--colorful-motion-enabled")
        .trim() !== "1"
    )
      return;
    for (const layer of scope!.querySelectorAll<SVGGElement>(
      "[data-colorful-layer]",
    )) {
      const role = layer.getAttribute("data-colorful-layer")!;
      const order = role === "back" ? 0 : role === "surface" ? 1 : 2;
      const part = Number(layer.getAttribute("data-colorful-part") ?? 0);
      const delay = (order + part * 0.22) * stagger;
      if (mode === "morph" && layer.hasAttribute("data-colorful-morph")) {
        const path = layer.querySelector("path")!;
        const style = getComputedStyle(layer);
        const rest = style.getPropertyValue("--colorful-shape-rest").trim();
        const target = style.getPropertyValue("--colorful-shape-target").trim();
        if (rest && target && CSS.supports("d", rest))
          run(path, contourFrames(rest, target, easing), "d", rest, delay);
      }
      {
        const frames = transformFrames(mode, role, easing);
        run(
          layer,
          frames,
          "transform",
          String(frames[frames.length - 1].transform),
          delay,
        );
      }
    }
  }
  function leave() {
    if (host.matches(":hover, :focus-visible") || svg.matches(":focus-visible"))
      return;
    entered = false;
    if (media?.matches) {
      clear();
      return;
    }
    // Read every current pose before cancelling any animation.
    const poses = [...active].map(([element, item]) => ({
      element,
      ...item,
      from: getComputedStyle(element).getPropertyValue(item.property),
    }));
    clear();
    for (const { element, property, rest, from } of poses)
      run(
        element,
        [{ [property]: from, easing }, { [property]: rest }],
        property,
        rest,
        0,
        Math.min(320, duration * 0.4),
      );
  }
  function enter() {
    if (!entered) {
      entered = true;
      play();
    }
  }
  function focus() {
    if (host.matches(":focus-visible") || svg.matches(":focus-visible"))
      enter();
  }
  const blur = () => queueMicrotask(leave);
  function reduce() {
    if (media?.matches) {
      clear();
      entered = false;
    }
  }
  host.addEventListener("pointerenter", enter);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("focusin", focus);
  host.addEventListener("focusout", blur);
  media?.addEventListener("change", reduce);
  return {
    play,
    destroy() {
      clear();
      scope!.removeAttribute("data-colorful-motion-managed");
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("focusin", focus);
      host.removeEventListener("focusout", blur);
      media?.removeEventListener("change", reduce);
    },
  };
}
export function useLayerMotion(
  ref: RefObject<SVGSVGElement | null>,
  props: IconBaseProps,
) {
  const controller = useRef<ReturnType<typeof attachLayerMotion> | null>(null);
  const lastReplay = useRef(props.hoverReplayKey);
  useEffect(() => {
    if (ref.current) controller.current = attachLayerMotion(ref.current, props);
    return () => {
      controller.current?.destroy();
      controller.current = null;
    };
  }, [
    ref,
    props.weights,
    props.weight,
    props.animationKey,
    props.entrance,
    props.hoverAnimation,
    props.hoverEasing,
    props.hoverDuration,
    props.hoverStagger,
  ]);
  useEffect(() => {
    if (lastReplay.current !== props.hoverReplayKey) {
      lastReplay.current = props.hoverReplayKey;
      controller.current?.play();
    }
  }, [props.hoverReplayKey]);
}
