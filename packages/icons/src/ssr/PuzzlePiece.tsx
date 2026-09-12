/* GENERATED FILE — edit assets/regular or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import SSRBase from "../lib/SSRBase";
import artwork from "../defs/PuzzlePiece";

/** 拼图 · piece · 游戏 */
const I: Icon = forwardRef((props, ref) => <SSRBase ref={ref} {...props} weights={artwork} />);
I.displayName = "PuzzlePieceIcon";
export { I as PuzzlePieceIcon, I as PuzzlePiece };
