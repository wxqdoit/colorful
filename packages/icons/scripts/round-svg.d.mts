export interface RoundnessIssue {
  kind: string;
  subpath?: number;
  point?: [number, number];
  angle?: number;
}
export function inspectRoundness(source: string): {
  elements: number;
  filledPaths: number;
  issues: RoundnessIssue[];
};
export function roundSVG(source: string): {
  source: string;
  corners: number;
  rectangles: number;
};
