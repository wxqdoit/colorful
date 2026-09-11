import { version } from "react";
import css from "../motion.css?raw";
import type { IconProps } from "./types";

// A content-based key also deduplicates separate copies of this package.
let hash = 2166136261;
for (let i = 0; i < css.length; i++)
  hash = Math.imul(hash ^ css.charCodeAt(i), 16777619);
export const motionStyleId = `colorful-motion-${(hash >>> 0).toString(36)}`;
export const supportsStyleResources = Number.parseInt(version, 10) >= 19;

export function needsMotionStyles(props: IconProps) {
  return (
    props.motionStyles !== "manual" &&
    ((props.entrance !== undefined && props.entrance !== "none") ||
      (props.hoverAnimation !== undefined && props.hoverAnimation !== "none") ||
      props.mirrored === true ||
      (props.mirrorDuration !== undefined && props.mirrorDuration > 0))
  );
}

/** React 19 hoists/deduplicates this on both server and client. In React 18 SSR,
 * render it once in the document head to provide styles before hydration. */
export function MotionStyles() {
  return supportsStyleResources ? (
    <style href={motionStyleId} precedence="colorful">
      {css}
    </style>
  ) : (
    <style data-colorful-motion={motionStyleId}>{css}</style>
  );
}

/** React 18 client fallback. Keep the shared sheet after unmount to avoid
 * restarting animations in other roots or StrictMode mounts. */
export function ensureMotionStyles(doc: Document) {
  if (
    doc.querySelector(
      `style[data-colorful-motion="${motionStyleId}"],style[data-href~="${motionStyleId}"]`,
    )
  )
    return;
  const sheet = doc.createElement("style");
  sheet.setAttribute("data-colorful-motion", motionStyleId);
  sheet.textContent = css;
  doc.head.appendChild(sheet);
}
