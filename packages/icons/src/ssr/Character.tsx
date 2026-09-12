/* GENERATED FILE — edit assets/regular or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import SSRBase from "../lib/SSRBase";
import artwork from "../defs/Character";

/** 角色 · 创作 */
const I: Icon = forwardRef((props, ref) => <SSRBase ref={ref} {...props} weights={artwork} />);
I.displayName = "CharacterIcon";
export { I as CharacterIcon, I as Character };
