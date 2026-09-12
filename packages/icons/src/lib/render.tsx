import {
  Children,
  cloneElement,
  isValidElement,
  type Ref,
  type ReactNode,
} from "react";
import { palettePresets, paletteStyle } from "./palette";
import type { IconBaseProps, IconWeight } from "./types";
import {
  MotionStyles,
  needsMotionStyles,
  supportsStyleResources,
} from "./MotionStyles";

const weightWidths = {
  thin: 0.45,
  light: 0.75,
  regular: 1.1,
  bold: 1.8,
  fill: 1.1,
  duotone: 1.1,
} as const;

const shapeElements = new Set([
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
]);

type ArtworkProps = Record<string, unknown>;
const derivedCache = new WeakMap<object, Map<string, ReactNode>>();

/** Derive a requested weight from one regular artwork tree at render time. */
function deriveArtwork(
  node: ReactNode,
  weight: keyof typeof weightWidths,
  scale: number,
): ReactNode {
  if (!isValidElement(node)) return node;
  if (weight === "regular") return node;
  const cachedByWeight = derivedCache.get(node);
  const cached = cachedByWeight?.get(weight);
  if (cached) return cached;
  const props = node.props as ArtworkProps;
  const next: ArtworkProps = {};
  const tag = typeof node.type === "string" ? node.type : "";
  const fill = typeof props.fill === "string" ? props.fill : undefined;

  if (props.children !== undefined)
    next.children = Children.map(props.children as ReactNode, (child) =>
      deriveArtwork(child, weight, scale),
    );

  if (
    weight !== "fill" &&
    weight !== "duotone" &&
    typeof props.strokeWidth === "number"
  ) {
    next.strokeWidth = Number(
      ((props.strokeWidth * scale) / weightWidths.regular).toFixed(6),
    );
  }

  if (shapeElements.has(tag) && fill && fill !== "none") {
    if (weight === "fill" && props.stroke === "none") {
      next.stroke = fill;
      next.strokeWidth = fill.includes("--project-art-detail") ? 0.2 : 0.55;
    }
    if (weight === "duotone" && !fill.includes("--project-art-surface"))
      next.fill = "var(--project-art-detail, #aa8bcf)";
  }

  const result = Object.keys(next).length ? cloneElement(node, next) : node;
  (cachedByWeight ?? new Map()).set(weight, result);
  if (!cachedByWeight) derivedCache.set(node, new Map([[weight, result]]));
  return result;
}

function selectArtwork(
  source: IconBaseProps["weights"],
  weight: IconWeight,
): ReactNode {
  if (
    source &&
    typeof (source as ReadonlyMap<IconWeight, ReactNode>).get === "function"
  )
    return (
      (source as ReadonlyMap<IconWeight, ReactNode>).get(weight) ??
      (source as ReadonlyMap<IconWeight, ReactNode>).get("regular")
    );
  return source;
}

/** Context-free SVG rendering shared by both entry points. */
export function renderIcon(props: IconBaseProps, ref: Ref<SVGSVGElement>) {
  const {
    weights,
    alt,
    color,
    size = 26,
    weight = "regular",
    mirrored = false,
    theme,
    preset,
    palette,
    style,
    children,
    entrance = "none",
    hoverAnimation = "none",
    hoverEasing = "spring",
    hoverDuration = 900,
    hoverStagger = 65,
    hoverReplayKey: _hoverReplayKey,
    animationKey,
    animationDuration = 560,
    animationDelay = 0,
    mirrorDuration = 320,
    motionStyles: _motionStyles,
    ...rest
  } = props;
  const named = Boolean(alt || rest["aria-label"] || rest["aria-labelledby"]);
  const selectedArtwork = selectArtwork(weights, weight);
  const artwork = deriveArtwork(selectedArtwork, weight, weightWidths[weight]);
  return (
    <>
      {supportsStyleResources && needsMotionStyles(props) ? (
        <MotionStyles />
      ) : null}
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--project-art-detail, #aa8bcf)"
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-colorful-icon=""
        aria-hidden={named ? undefined : true}
        role={named ? "img" : undefined}
        focusable="false"
        {...rest}
        style={{
          ...(theme || preset
            ? paletteStyle(
                palettePresets[preset ?? "lavender"][theme ?? "light"],
              )
            : {}),
          ...({
            "--colorful-duration": `${Math.max(0, animationDuration)}ms`,
            "--colorful-hover-duration": `${Math.max(0, hoverDuration)}ms`,
            "--colorful-hover-stagger": `${Math.max(0, hoverStagger)}ms`,
            "--colorful-delay": `${Math.max(0, animationDelay)}ms`,
            "--colorful-mirror-duration": `${Math.max(0, mirrorDuration)}ms`,
          } as React.CSSProperties),
          ...paletteStyle(palette ?? {}),
          ...(color !== undefined ? paletteStyle({ detail: color }) : {}),
          ...style,
        }}
      >
        {alt ? <title>{alt}</title> : null}
        {children}
        <g
          data-colorful-mirror=""
          style={{
            transform: `scaleX(${mirrored ? -1 : 1})`,
            transformOrigin: "12px 12px",
          }}
        >
          <g data-colorful-enter={entrance} key={animationKey}>
            <g
              data-colorful-hover={hoverAnimation}
              data-colorful-easing={hoverEasing}
              strokeWidth={weightWidths[weight]}
            >
              {artwork}
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}
