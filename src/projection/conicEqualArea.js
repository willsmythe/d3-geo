import {abs, asin, atan2, cos, epsilon, sign, sin, sqrt} from "../math";
import {conicProjection} from "./conic";

export function conicEqualAreaRaw(y0, y1) {
  var sy0 = sin(y0),
      n = (sy0 + sin(y1)) / 2,
      c = 1 + sy0 * (2 * n - sy0);

  // gracefully handle the limit case where the two standard parallels
  // are symetrical with the Equator
  if (abs(n) < epsilon) {
    n = (n < 0 ? -1 : 1) * epsilon;
  }

  var r0 = sqrt(c) / n;

  function project(x, y) {
    var r = sqrt(c - 2 * n * sin(y)) / n;
    return [r * sin(x *= n), r0 - r * cos(x)];
  }

  project.invert = function(x, y) {
    var r0y = r0 - y;
    return [atan2(x, abs(r0y)) / n * sign(r0y), asin((c - (x * x + r0y * r0y) * n * n) / (2 * n))];
  };

  return project;
}

export default function() {
  return conicProjection(conicEqualAreaRaw)
      .scale(155.424)
      .center([0, 33.6442]);
}
