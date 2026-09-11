import { paper } from "./geometry.mjs";

export const CORNER_RADIUS = 0.65;
// Below one degree, export precision and almost-collinear joins are visually smooth.
export const ANGLE_TOLERANCE = 1;
const epsilon = 1e-7;

function contours(data, close = true) {
  const item = paper.PathItem.create(data);
  item.remove();
  const paths = item.children ? [...item.children] : [item];
  for (const path of paths) {
    // SVG implicitly closes every filled subpath, even without a Z command.
    if (close) path.closePath();
    // Zero-length edges carry no contour but can hide a join from a tangent audit.
    for (let i = path.segments.length - 1; i >= 0; i--) {
      const curve = path.curves[i];
      if (curve && curve.length < epsilon && path.segments.length > 1) {
        const next = curve.segment2,
          current = curve.segment1;
        current.handleOut = next.handleOut.clone();
        path.removeSegment(next.index);
      }
    }
  }
  return paths;
}
function turn(incoming, outgoing) {
  const a = incoming.getTangentAtTime(1),
    b = outgoing.getTangentAtTime(0);
  if (!a?.length || !b?.length) return 0;
  return Math.acos(Math.max(-1, Math.min(1, a.normalize().dot(b.normalize()))));
}
export function sharpJoins(data, close = true) {
  const result = [];
  for (const [subpath, path] of contours(data, close).entries()) {
    const curves = path.curves;
    for (let i = path.closed ? 0 : 1; i < curves.length; i++) {
      const angle =
        (turn(curves[(i + curves.length - 1) % curves.length], curves[i]) *
          180) /
        Math.PI;
      if (angle > ANGLE_TOLERANCE)
        result.push({
          subpath,
          point: [curves[i].point1.x, curves[i].point1.y],
          angle,
        });
    }
  }
  return result;
}
export function roundPath(data, radius = CORNER_RADIUS, close = true) {
  let changed = 0;
  const output = contours(data, close).map((path) => {
    const curves = path.curves;
    if (curves.length < 1) return path.getPathData(null, 8);
    const trim = curves.map((curve, i) => {
      if (!path.closed && i === 0) return 0;
      const before = curves[(i + curves.length - 1) % curves.length];
      const theta = turn(before, curve);
      if ((theta * 180) / Math.PI <= ANGLE_TOLERANCE) return 0;
      changed++;
      return Math.min(
        radius * Math.tan(theta / 2),
        radius * 2.3,
        before.length * 0.32,
        curve.length * 0.32,
      );
    });
    if (!trim.some(Boolean)) return path.getPathData(null, 8);
    const edges = curves.map((curve, i) =>
      curve.getPart(
        curve.getTimeAt(trim[i]) ?? 0,
        curve.getTimeAt(curve.length - trim[(i + 1) % curves.length]) ?? 1,
      ),
    );
    const rounded = new paper.Path({ insert: false });
    rounded.moveTo(edges[0].point1);
    edges.forEach((edge, i) => {
      if (edge.isStraight()) rounded.lineTo(edge.point2);
      else
        rounded.cubicCurveTo(
          edge.point1.add(edge.handle1),
          edge.point2.add(edge.handle2),
          edge.point2,
        );
      const next = edges[(i + 1) % edges.length];
      if (trim[(i + 1) % edges.length]) {
        const a = edge.getTangentAtTime(1).normalize(),
          b = next.getTangentAtTime(0).normalize();
        // Cubic fillet: exact endpoint tangency to both retained contour sections.
        const chord = edge.point2.getDistance(next.point1);
        const theta = Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
        const h = close
          ? Math.min(trim[(i + 1) % edges.length] * 0.8, chord * 0.55)
          : Math.min(
              trim[(i + 1) % edges.length],
              (chord * (2 / 3)) / (1 + Math.cos(theta / 2)),
            );
        rounded.cubicCurveTo(
          edge.point2.add(a.multiply(h)),
          next.point1.subtract(b.multiply(h)),
          next.point1,
        );
      }
    });
    if (path.closed) rounded.closePath();
    return rounded.getPathData(null, 8);
  });
  return { data: changed ? output.join(" ") : data, corners: changed };
}
