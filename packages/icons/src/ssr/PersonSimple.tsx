/* GENERATED FILE — edit assets/regular, assets/overrides or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import SSRBase from "../lib/SSRBase";
import weights from "../defs/PersonSimple";

/** 站立人物 · 功能符号 */
const I: Icon = forwardRef((props, ref) => <SSRBase ref={ref} {...props} weights={weights} />);
I.displayName = "PersonSimpleIcon";
export { I as PersonSimpleIcon, I as PersonSimple };
