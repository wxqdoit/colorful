"use client";
import { forwardRef, useContext, useRef, useImperativeHandle } from "react";
import { IconContext } from "./context";
import { useLayerMotion } from "./useLayerMotion";
import { useMotionStyles } from "./useMotionStyles";
import { renderIcon } from "./render";
import type { IconBaseProps } from "./types";

const IconBase = forwardRef<SVGSVGElement, IconBaseProps>((props, ref) => {
  const context = useContext(IconContext);
  // Undefined means inherit; false, zero and empty strings are explicit values.
  const explicit = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  );
  const resolved: IconBaseProps = {
    ...context,
    ...explicit,
    weights: props.weights,
    color:
      props.color ??
      (props.palette?.detail !== undefined ? undefined : context.color),
    palette: { ...context.palette, ...props.palette },
    style: { ...context.style, ...props.style },
  };
  const svgRef = useRef<SVGSVGElement>(null);
  useImperativeHandle(ref, () => svgRef.current!, []);
  useMotionStyles(resolved);
  useLayerMotion(svgRef, resolved);
  return renderIcon(resolved, svgRef);
});
IconBase.displayName = "IconBase";
export default IconBase;
