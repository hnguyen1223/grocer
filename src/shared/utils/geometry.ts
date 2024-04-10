export function isPointInArc(
  point: { x: number; y: number },
  arc: {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
  }
): boolean {
  const sqrDist = point.x * point.x + point.y * point.y;
  let angle = Math.atan2(point.x, -point.y);
  angle = angle < 0 ? angle + Math.PI * 2 : angle;
  return (
    arc.innerRadius * arc.innerRadius <= sqrDist &&
    sqrDist <= arc.outerRadius * arc.outerRadius &&
    arc.startAngle <= angle &&
    angle <= arc.endAngle
  );
}
