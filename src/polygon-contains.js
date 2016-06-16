import adder from "./adder";
import {cartesian, cartesianCross, cartesianNormalizeInPlace} from "./cartesian";
import {asin, atan2, cos, epsilon, pi, quarterPi, sin, tau} from "./math";

var sum = adder();

export default function(polygon, point) {
  var meridian = point[0],
      parallel = point[1],
      meridianNormal = [sin(meridian), -cos(meridian), 0],
      polarAngle = 0,
      winding = 0;

  for (var i = 0, n = polygon.length; i < n; ++i) {
    var ring = polygon[i],
        m = ring.length;
    if (!m) continue;
    var point0 = ring[0],
        lambda0 = point0[0],
        phi0 = point0[1] / 2 + quarterPi,
        sinPhi0 = sin(phi0),
        cosPhi0 = cos(phi0),
        j = 1;

    while (true) {
      if (j === m) j = 0;
      point = ring[j];
      var lambda = point[0],
          phi = point[1] / 2 + quarterPi,
          sinPhi = sin(phi),
          cosPhi = cos(phi),
          delta = lambda - lambda0,
          sign = delta >= 0 ? 1 : -1,
          absDelta = sign * delta,
          antimeridian = absDelta > pi,
          k = sinPhi0 * sinPhi;

      sum.add(atan2(k * sign * sin(absDelta), cosPhi0 * cosPhi + k * cos(absDelta)));
      polarAngle += antimeridian ? delta + sign * tau : delta;

      // Are the longitudes either side of the point's meridian, and are the
      // latitudes smaller than the parallel?
      if (antimeridian ^ lambda0 >= meridian ^ lambda >= meridian) {
        var arc = cartesianCross(cartesian(point0), cartesian(point));
        cartesianNormalizeInPlace(arc);
        var intersection = cartesianCross(meridianNormal, arc);
        cartesianNormalizeInPlace(intersection);
        var phiArc = (antimeridian ^ delta >= 0 ? -1 : 1) * asin(intersection[2]);
        if (parallel > phiArc || parallel === phiArc && (arc[0] || arc[1])) {
          winding += antimeridian ^ delta >= 0 ? 1 : -1;
        }
      }

      if (!j++) break;

      lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi, point0 = point;
    }
  }

  // First, determine whether the South pole is inside or outside:
  //
  // It is inside if:
  // * the polygon winds around it in a clockwise direction.
  // * the polygon does not (cumulatively) wind around it, but has a negative
  //   (counter-clockwise) area.
  //
  // Second, count the (signed) number of times a segment crosses a meridian
  // from the point to the South pole.  If it is zero, then the point is the
  // same side as the South pole.

  var contains = (polarAngle < -epsilon || polarAngle < epsilon && sum < -epsilon) ^ (winding & 1);
  sum.reset();
  return contains;
}
