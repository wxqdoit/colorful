import { paper } from "./geometry.mjs";
type Path = InstanceType<typeof paper.Path>;
type CompoundPath = InstanceType<typeof paper.CompoundPath>;
type Segment = InstanceType<typeof paper.Segment>;
type Point = InstanceType<typeof paper.Point>;

/** Primitive outlines; all animated endpoints share cubic command topology. */
export function shapePath(shape: Element): string | null {
  const n = (key: string) => Number(shape.getAttribute(key) ?? 0);
  if (shape.localName === "path") return shape.getAttribute("d");
  let item: Path;
  if (shape.localName === "circle" || shape.localName === "ellipse") {
    const rx = shape.localName === "circle" ? n("r") : n("rx");
    const ry = shape.localName === "circle" ? n("r") : n("ry");
    item = new paper.Path.Ellipse(
      new paper.Rectangle(n("cx") - rx, n("cy") - ry, 2 * rx, 2 * ry),
    );
  } else if (shape.localName === "rect") {
    const rx = Math.min(
      n("width") / 2,
      Number(shape.getAttribute("rx") ?? shape.getAttribute("ry") ?? 0),
    );
    const ry = Math.min(
      n("height") / 2,
      Number(shape.getAttribute("ry") ?? shape.getAttribute("rx") ?? 0),
    );
    item = new paper.Path.Rectangle(
      new paper.Rectangle(n("x"), n("y"), n("width"), n("height")),
      new paper.Size(rx, ry),
    );
  } else if (shape.localName === "polygon" || shape.localName === "polyline") {
    const points = (shape.getAttribute("points") ?? "")
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    item = new paper.Path();
    for (let i = 0; i < points.length; i += 2)
      item.add(new paper.Point(points[i], points[i + 1]));
    item.closed = true;
  } else return null;
  const d = item.pathData;
  item.remove();
  return d;
}
const cache = new Map<string, { rest: string; target: string }>();
export function morphPaths(d: string, role: string) {
  const key = role + d;
  const cached = cache.get(key);
  if (cached) return cached;
  const item = paper.PathItem.create(d) as Path | CompoundPath;
  const paths = (
    item instanceof paper.CompoundPath ? item.children : [item]
  ) as Path[];
  const bounds = item.bounds.clone();
  const w = Math.max(bounds.width, 0.1),
    h = Math.max(bounds.height, 0.1);
  const cx = bounds.center.x,
    cy = bounds.center.y;
  const sign = role === "back" ? -1 : 1;
  const ax = Math.min(1.65, w * 0.15) * sign;
  const ay = Math.min(1.35, h * 0.12) * sign;
  // Split long curves exactly before bending. The Jacobian transforms both
  // handles at a join identically, retaining the original tangent continuity.
  for (const path of paths) {
    // SVG relative decimals can leave a microscopic duplicate closing anchor.
    // Merge it before interpolation so rounding cannot expose a phantom cusp.
    if (
      path.closed &&
      path.segments.length > 1 &&
      path.firstSegment.point.getDistance(path.lastSegment.point) < 1e-5
    ) {
      path.firstSegment.handleIn = path.lastSegment.point
        .add(path.lastSegment.handleIn)
        .subtract(path.firstSegment.point);
      path.lastSegment.remove();
    }
    for (const segment of path.segments) {
      if (segment.handleIn.length < 1e-6)
        segment.handleIn = new paper.Point(0, 0);
      if (segment.handleOut.length < 1e-6)
        segment.handleOut = new paper.Point(0, 0);
    }
    // Isolate zero-derivative cubic endpoints. This preserves their exact
    // resting shape while keeping the nonlinear endpoint tangent accurate.
    for (const curve of [...path.curves]) {
      const startZero = curve.segment1.handleOut.length === 0;
      const endZero = curve.segment2.handleIn.length === 0;
      if (startZero !== endZero) {
        if (endZero) curve.divideAtTime(0.99);
        if (startZero) curve.divideAtTime(0.01);
      }
    }
    for (let i = path.curves.length - 1; i >= 0; i--) {
      const curve = path.curves[i];
      if (
        curve.segment1.handleOut.length === 0 &&
        curve.segment2.handleIn.length === 0
      ) {
        const tangent = curve.segment2.point
          .subtract(curve.segment1.point)
          .divide(3);
        curve.segment1.handleOut = tangent;
        curve.segment2.handleIn = tangent.negate();
      }
      const divisions = Math.min(
        12,
        Math.max(1, Math.ceil(curve.length / 2.5)),
      );
      for (let j = divisions - 1; j > 0; j--) curve.divideAtTime(j / (j + 1));
    }
  }
  const point = (p: Point) => {
    const u = ((p.x - cx) * 2) / w,
      v = ((p.y - cy) * 2) / h;
    return new paper.Point(p.x + ax * (1 - v * v), p.y + ay * (1 - u * u));
  };
  const handle = (p: Point, v: Point) =>
    new paper.Point(
      v.x - ((8 * ax * (p.y - cy)) / (h * h)) * v.y,
      v.y - ((8 * ay * (p.x - cx)) / (w * w)) * v.x,
    );
  const coord = (p: Point) => `${+p.x.toFixed(9)} ${+p.y.toFixed(9)}`;
  function serialize(warp: boolean) {
    return paths
      .map((path) => {
        const segments = path.segments;
        if (!segments.length) return "";
        const anchor = (s: Segment) => (warp ? point(s.point) : s.point);
        const control = (s: Segment, direction: "handleIn" | "handleOut") => {
          if (!warp) return s.point.add(s[direction]);
          const incoming = handle(s.point, s.handleIn),
            outgoing = handle(s.point, s.handleOut);
          let result = direction === "handleIn" ? incoming : outgoing;
          const before = s.previous?.curve,
            after = s.curve;
          if (before && after) {
            const inTangent = handle(
              s.point,
              before.getTangentAtTime(1),
            ).normalize();
            const outTangent = handle(
              s.point,
              after.getTangentAtTime(0),
            ).normalize();
            if (inTangent.dot(outTangent) > 0.98) {
              const tangent = inTangent.add(outTangent).normalize();
              const length =
                direction === "handleIn"
                  ? incoming.length || before.length * 0.06
                  : outgoing.length || after.length * 0.06;
              result = tangent.multiply(
                direction === "handleIn" ? -length : length,
              );
            }
          }
          return anchor(s).add(result);
        };
        let data = `M${coord(anchor(segments[0]))}`;
        for (
          let i = 1;
          i <= (path.closed ? segments.length : segments.length - 1);
          i++
        ) {
          const a = segments[i - 1],
            b = segments[i % segments.length];
          data += `C${coord(control(a, "handleOut"))} ${coord(control(b, "handleIn"))} ${coord(anchor(b))}`;
        }
        return data + (path.closed ? "Z" : "");
      })
      .join("");
  }
  const pair = { rest: serialize(false), target: serialize(true) };
  item.remove();
  cache.set(key, pair);
  return pair;
}
