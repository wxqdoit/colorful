import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";

// Paper's geometry works without a canvas. Isolate its browser build to avoid
// loading native node-canvas just to perform vector boolean operations.
const require = createRequire(import.meta.url);
const sandbox = {
  self: { navigator: { userAgent: "ColorfulGeometry" } },
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
};
runInNewContext(
  readFileSync(require.resolve("paper/dist/paper-core.js"), "utf8"),
  sandbox,
);
export const paper = sandbox.paper;
paper.setup(new paper.Size(24, 24));
paper.view.autoUpdate = false;

export function softCorners(item, radius = 0.45) {
  if (item.children) {
    item.children.forEach((child) => softCorners(child, radius));
    return item;
  }
  if (!item.closed || item.segments.length < 3) return item;
  const original = item.segments.map((s) => s.clone());
  const segments = [];
  for (let i = 0; i < original.length; i++) {
    const previous = original[(i + original.length - 1) % original.length];
    const current = original[i];
    const next = original[(i + 1) % original.length];
    const a = previous.point.subtract(current.point),
      b = next.point.subtract(current.point);
    if (
      current.handleIn.length +
        current.handleOut.length +
        previous.handleOut.length +
        next.handleIn.length <
        1e-6 &&
      a.length > 0.2 &&
      b.length > 0.2 &&
      Math.abs(a.normalize().cross(b.normalize())) > 0.1
    ) {
      const distance = Math.min(radius, a.length * 0.2, b.length * 0.2);
      const entry = current.point.add(a.normalize(distance));
      const exit = current.point.add(b.normalize(distance));
      segments.push(
        new paper.Segment(
          entry,
          null,
          current.point.subtract(entry).multiply(2 / 3),
        ),
      );
      segments.push(
        new paper.Segment(
          exit,
          current.point.subtract(exit).multiply(2 / 3),
          null,
        ),
      );
    } else segments.push(current);
  }
  item.segments = segments;
  return item;
}

export function subpath(path, from, to) {
  let copy = path.clone({ insert: false });
  if (copy.closed) copy.splitAt(0);
  const tail = copy.splitAt(Math.min(to, copy.length - 0.00001));
  tail?.remove();
  if (from > 0.00001) {
    const part = copy.splitAt(from);
    copy.remove();
    copy = part;
  }
  return copy;
}
