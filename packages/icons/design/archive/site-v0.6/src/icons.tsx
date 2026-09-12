import { lazy, Suspense, type ComponentType, type Ref } from "react";
import type { IconProps } from "../../src/lib/types";

const modules = import.meta.glob<Record<string, ComponentType<IconProps>>>(
  "../../src/csr/*.tsx",
);
const cache = new Map<
  string,
  ReturnType<typeof lazy<ComponentType<IconProps>>>
>();
export function CatalogIcon({
  name,
  ...props
}: IconProps & { name: string; ref?: Ref<SVGSVGElement> }) {
  if (!cache.has(name)) {
    const load = modules[`../../src/csr/${name}.tsx`];
    if (!load) throw new Error(`Unknown icon: ${name}`);
    cache.set(
      name,
      lazy(async () => ({ default: (await load())[`${name}Icon`] })),
    );
  }
  const Component = cache.get(name)!;
  return (
    <Suspense
      fallback={<span className="icon-loading" aria-label="图标加载中" />}
    >
      <Component {...props} />
    </Suspense>
  );
}
