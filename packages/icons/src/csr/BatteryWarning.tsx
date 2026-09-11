"use client";
/* GENERATED FILE — edit assets/regular, assets/overrides or assets/catalog.json; run npm run assemble. */
import { forwardRef } from "react";
import type { Icon } from "../lib/types";
import IconBase from "../lib/IconBase";
import weights from "../defs/BatteryWarning";

/** 电池 · warning · 系统 */
const I: Icon = forwardRef((props, ref) => <IconBase ref={ref} {...props} weights={weights} />);
I.displayName = "BatteryWarningIcon";
export { I as BatteryWarningIcon, I as BatteryWarning };
