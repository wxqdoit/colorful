export const CORNER_RADIUS: number;
export const ANGLE_TOLERANCE: number;
export interface SharpJoin {
  subpath: number;
  point: [number, number];
  angle: number;
}
export function sharpJoins(data: string, close?: boolean): SharpJoin[];
export function roundPath(
  data: string,
  radius?: number,
  close?: boolean,
): { data: string; corners: number };
