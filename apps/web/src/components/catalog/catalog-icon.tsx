import { useEffect, useState, type ComponentType } from "react";
import type { IconProps } from "@colorful-icons/react/lib";
import { Skeleton } from "@/components/ui/skeleton";
import { iconLoaders } from "@/lib/icon-loaders";
import type { Messages } from "@/lib/i18n";

const resolved = new Map<string, ComponentType<IconProps>>();
const pending = new Map<string, Promise<ComponentType<IconProps>>>();
function loadIcon(name: string) {
  let promise = pending.get(name);
  if (!promise) {
    promise = iconLoaders[name]()
      .then((module) => {
        const Icon = module[`${name}Icon`];
        if (!Icon) throw new Error(`Missing icon export: ${name}`);
        resolved.set(name, Icon);
        return Icon;
      })
      .catch((error) => {
        pending.delete(name);
        throw error;
      });
    pending.set(name, promise);
  }
  return promise;
}

export function CatalogIcon({
  name,
  messages,
  ...props
}: IconProps & { name: string; messages: Messages }) {
  const [loaded, setLoaded] = useState<{
    name: string;
    Icon: ComponentType<IconProps>;
  } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const Icon =
    resolved.get(name) ?? (loaded?.name === name ? loaded.Icon : null);
  useEffect(() => {
    if (resolved.has(name)) return;
    let active = true;
    loadIcon(name)
      .then((Icon) => {
        if (active) setLoaded({ name, Icon });
      })
      .catch(() => {
        if (active) setFailed(name);
      });
    return () => {
      active = false;
    };
  }, [name]);
  if (Icon) return <Icon {...props} />;
  if (failed === name)
    return (
      <span role="status" title={messages.loadFailed}>
        —
      </span>
    );
  return <Skeleton className="size-10" aria-label={messages.loading} />;
}
