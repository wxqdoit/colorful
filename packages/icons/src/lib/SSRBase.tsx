import { forwardRef } from "react";
import { renderIcon } from "./render";
import type { IconBaseProps } from "./types";

const SSRBase = forwardRef<SVGSVGElement, IconBaseProps>(renderIcon);
SSRBase.displayName = "SSRBase";
export default SSRBase;
