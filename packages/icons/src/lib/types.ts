import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
} from "react";

export type IconWeight =
  "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
export type IconTheme = "light" | "dark";
export type IconPreset =
  | "lavender"
  | "mint"
  | "peach"
  | "ocean"
  | "rose"
  | "sand"
  | "graphite"
  | "tangerine";
export type IconEntrance = "none" | "pop" | "rise" | "fade";
export type IconHover =
  "none" | "lift" | "wiggle" | "pulse" | "spread" | "morph";
export type IconEasing = "smooth" | "gentle" | "snappy" | "spring" | "linear";
export interface IconPalette {
  surface?: string;
  back?: string;
  detail?: string;
  outline?: string;
  stripe?: string;
  accent?: string;
}
export type IconStyle = CSSProperties & {
  [key: `--project-art-${string}`]: string | number | undefined;
};
export interface IconProps
  extends ComponentPropsWithoutRef<"svg">, RefAttributes<SVGSVGElement> {
  alt?: string;
  /** Changes the detail color; layered fills remain independent. */
  color?: string;
  size?: string | number;
  weight?: IconWeight;
  mirrored?: boolean;
  theme?: IconTheme;
  preset?: IconPreset;
  palette?: IconPalette;
  /** Automatically register motion styles when needed; manual requires motion.css or MotionStyles. */
  motionStyles?: "auto" | "manual";
  /** Entrance animation; required styles are registered automatically by default. */
  entrance?: IconEntrance;
  /** Animates individual artwork layers, never the whole hover group. */
  hoverAnimation?: IconHover;
  hoverEasing?: IconEasing;
  hoverDuration?: number;
  hoverStagger?: number;
  /** Change to replay the choreographed hover sequence without remounting. */
  hoverReplayKey?: string | number;
  /** Change to replay the entrance without remounting the root SVG/ref. */
  animationKey?: string | number;
  animationDuration?: number;
  animationDelay?: number;
  mirrorDuration?: number;
  style?: IconStyle;
}
export interface IconBaseProps extends IconProps {
  /**
   * One regular artwork is preferred; the legacy weight map remains accepted
   * for custom icons and older generated modules.
   */
  weights: ReactElement | ReadonlyMap<IconWeight, ReactElement>;
}
export type Icon = ForwardRefExoticComponent<IconProps>;
