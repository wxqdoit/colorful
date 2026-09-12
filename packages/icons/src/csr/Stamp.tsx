"use client";
/* GENERATED FILE — edit assets/regular or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import IconBase from "../lib/IconBase";
import artwork from "../defs/Stamp";

/** 印章 · 物件 */
const I: Icon = forwardRef((props, ref) => <IconBase ref={ref} {...props} weights={artwork} />);
I.displayName = "StampIcon";
export { I as StampIcon, I as Stamp };
