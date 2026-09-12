export const styleRules: Readonly<{ version: string; canvas: number; stroke: number; fillRadiusMin: number; fillRadiusMax: number; rectangleRadiusMax: number; maxLineLength: number; maxLineContours: number }>;
export const opticalOffsets: Record<string, [number, number]>;
export function styledOriginal(entry: {slug: string; body: string}): string;
export function inspectStyle(source: string): {lineLength: number; lineContours: number; fillLayers: string[]; issues: string[]};
