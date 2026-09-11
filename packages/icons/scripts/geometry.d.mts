import type { PaperScope, PathItem, Path } from "paper";
export const paper: PaperScope;
export function softCorners<T extends PathItem>(item: T, radius?: number): T;
export function subpath(path: Path, from: number, to: number): Path;
