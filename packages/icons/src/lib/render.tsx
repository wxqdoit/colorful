import type { Ref } from "react";
import { palettePresets, paletteStyle } from "./palette";
import type { IconBaseProps } from "./types";
import {
  MotionStyles,
  needsMotionStyles,
  supportsStyleResources,
} from "./MotionStyles";

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
            >
              {weights.get(weight)}
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}
