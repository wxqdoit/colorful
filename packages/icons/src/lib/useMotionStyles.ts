"use client";
import { useInsertionEffect } from "react";
import {
  ensureMotionStyles,
  needsMotionStyles,
  supportsStyleResources,
} from "./MotionStyles";
import type { IconProps } from "./types";

export function useMotionStyles(props: IconProps) {
  const enabled = needsMotionStyles(props);
  useInsertionEffect(() => {
    if (!supportsStyleResources && enabled) ensureMotionStyles(document);
  }, [enabled]);
}
