import type { IconPalette, IconStyle } from "./types";

export const palettePresets = {
  lavender: {
    label: "浅紫梦境",
    light: { surface: "#f0e9f8", back: "#d9c9ed", detail: "#aa8bcf" },
    dark: { surface: "#746188", back: "#af94ca", detail: "#efdcfa" },
  },
  mint: {
    label: "薄荷花园",
    light: { surface: "#e5f2e9", back: "#afd5c2", detail: "#548b76" },
    dark: { surface: "#273e37", back: "#446e5d", detail: "#a6d9c0" },
  },
  peach: {
    label: "蜜桃日落",
    light: { surface: "#fff0e6", back: "#f2c0aa", detail: "#c77f70" },
    dark: { surface: "#49352e", back: "#8c5b49", detail: "#f1baa0" },
  },
  ocean: {
    label: "海盐晴空",
    light: { surface: "#e8f0fa", back: "#b6cfea", detail: "#668caf" },
    dark: { surface: "#29384b", back: "#45698b", detail: "#a5c9e9" },
  },
  rose: {
    label: "玫瑰奶霜",
    light: { surface: "#f9e9ef", back: "#e8b9cb", detail: "#b26e92" },
    dark: { surface: "#452e3b", back: "#7d4e67", detail: "#e5b1ce" },
  },
  sand: {
    label: "暖杏午后",
    light: { surface: "#f7f0dc", back: "#e6d09f", detail: "#a48b52" },
    dark: { surface: "#403a29", back: "#79693f", detail: "#ddc88c" },
  },
  graphite: {
    label: "石墨黑灰",
    light: { surface: "#e5e5e5", back: "#a3a3a3", detail: "#262626" },
    dark: { surface: "#404040", back: "#8c8c8c", detail: "#ededed" },
  },
  tangerine: {
    label: "橙柠撞色",
    light: { surface: "#deee91", back: "#ff984d", detail: "#63851f" },
    dark: { surface: "#516523", back: "#ee9550", detail: "#e5f4a5" },
  },
} as const;

export const palettes = {
  light: palettePresets.lavender.light,
  dark: palettePresets.lavender.dark,
};

export function paletteStyle(palette: IconPalette): IconStyle {
  const style: IconStyle = {};
  const colors = {
    surface: palette.surface,
    back: palette.back,
    detail:
      palette.detail ?? palette.accent ?? palette.outline ?? palette.stripe,
  };
  for (const key of ["surface", "back", "detail"] as const) {
    if (colors[key] !== undefined) style[`--project-art-${key}`] = colors[key];
  }
  return style;
}
