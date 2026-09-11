import type { IconEasing, IconHover } from "./types";

export const beats = [0, 0.14, 0.42, 0.66, 0.84, 1];
export const motionEasings: Record<IconEasing, string> = {
  smooth: "cubic-bezier(.25,.1,.25,1)",
  gentle: "cubic-bezier(.42,0,.58,1)",
  snappy: "cubic-bezier(.12,.9,.2,1)",
  spring: "cubic-bezier(.32,1.28,.5,1)",
  linear: "linear",
};
const number = /-?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi;
/** Matching cubic topology lets anticipation and recoil use the same contour. */
export function mixContour(rest: string, target: string, strength: number) {
  if (strength === 0) return rest;
  if (strength === 1) return target;
  const values = (target.match(number) ?? []).map(Number);
  let index = 0;
  return rest.replace(number, (value) =>
    String(
      +(Number(value) + (values[index++] - Number(value)) * strength).toFixed(
        7,
      ),
    ),
  );
}
export function contourFrames(
  rest: string,
  target: string,
  easing: string,
): Keyframe[] {
  const contourEasing =
    easing === motionEasings.spring ? "cubic-bezier(.22,.85,.25,1)" : easing;
  return [0, 0.12, 1, 0.08, 0.22, 0].map((value, i) => ({
    d: mixContour(rest, target, value),
    offset: beats[i],
    easing: contourEasing,
  }));
}
const restTransform = "translate(0px, 0px) rotate(0deg) scale(1, 1)";
export function transformFrames(
  mode: IconHover,
  role: string,
  easing: string,
): Keyframe[] {
  const index = role === "back" ? 0 : role === "surface" ? 1 : 2;
  const lift = [-1.3, -2.8, -3.4][index];
  const swing = [-12, 9, -15][index];
  const x = [-1.6, 1.2, 1.7][index],
    y = [1, -1.4, -2][index];
  const transform = (dx = 0, dy = 0, r = 0, sx = 1, sy = 1) =>
    `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(${sx}, ${sy})`;
  let poses: string[];
  if (mode === "lift")
    poses = [
      restTransform,
      transform(0, 0.5, -swing * 0.2, 1.1, 0.86),
      transform(0, lift, swing * 0.5, 0.94, 1.12),
      transform(0, 0.4, -swing * 0.16, 1.04, 0.96),
      transform(0, -0.25, swing * 0.06),
      restTransform,
    ];
  else if (mode === "wiggle")
    poses = [
      restTransform,
      transform(0, 0.15, -swing * 0.45, 1.03, 0.97),
      transform(0, -0.25, swing),
      transform(0, 0, -swing * 0.52),
      transform(0, 0, swing * 0.18),
      restTransform,
    ];
  else if (mode === "pulse")
    poses = [
      restTransform,
      transform(0, 0.2, 0, 1.12, 0.85),
      transform(0, -0.35, 0, 0.92, 1.17 + index * 0.035),
      transform(0, 0.1, 0, 1.07, 0.94),
      transform(0, 0, 0, 0.985, 1.035),
      restTransform,
    ];
  else if (mode === "spread")
    poses = [
      restTransform,
      transform(-x * 0.25, -y * 0.25, -swing * 0.2, 0.95, 0.95),
      transform(x, y, swing * 0.6, 1.04, 1.04),
      transform(-x * 0.2, -y * 0.2, -swing * 0.15),
      transform(x * 0.07, y * 0.07, swing * 0.06),
      restTransform,
    ];
  else if (role !== "detail")
    poses = [
      restTransform,
      transform(0, 0.55, 0, 1.12, 0.82),
      transform(0, -0.35, 0, 0.94, 1.11),
      transform(0, 0.22, 0, 1.055, 0.955),
      transform(0, -0.08, 0, 0.99, 1.025),
      restTransform,
    ];
  else
    poses = [
      restTransform,
      transform(0, 0.25, 0, 1.02, 0.97),
      transform(0.2, -0.55, 4, 1.045, 1.02),
      transform(-0.08, 0.18, -2),
      transform(0, -0.08, 0.6),
      restTransform,
    ];
  return poses.map((value, i) => ({
    transform: value,
    offset: beats[i],
    easing,
  }));
}
