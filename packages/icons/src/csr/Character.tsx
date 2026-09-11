"use client";
/* GENERATED FILE — edit assets/regular, assets/overrides or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import IconBase from "../lib/IconBase";
import weights from "../defs/Character";

/** 角色 · 创作 */
const I: Icon = forwardRef((props, ref) => <IconBase ref={ref} {...props} weights={weights} />);
I.displayName = "CharacterIcon";
export { I as CharacterIcon, I as Character };
