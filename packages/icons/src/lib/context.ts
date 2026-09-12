"use client";
import { createContext } from "react";
import type { IconProps } from "./types";

export const IconContext = createContext<IconProps>({
  size: 26,
  weight: "regular",
  mirrored: false,
});
