import adder from "./adder";
import {atan2, cos, fourPi, quarterPi, radians, sin} from "./math";
import noop from "./noop";
import stream from "./stream";

var areaSum,
    areaRingSum = adder();

var area = {
  sphere: function() { areaSum += fourPi; },
  point: noop,
  lineStart: noop,
  lineEnd: noop,

  // Only count area for polygon rings.
  polygonStart: function() {
    areaRingSum.reset();
    area.lineStart = areaRingStart;
  },
  polygonEnd: function() {
    var a = 2 * areaRingSum;
    areaSum += a < 0 ? fourPi + a : a;
    this.lineStart = this.lineEnd = this.point = noop;
  }
};

function areaRingStart() {
  var lambda00, phi00, lambda0, cosPhi0, sinPhi0; // start point and previous point

  // For the first point, …
  area.point = function(lambda, phi) {
    area.point = nextPoint;
    lambda00 = lambda, phi00 = phi;
    lambda *= radians, phi *= radians;
    lambda0 = lambda, cosPhi0 = cos(phi = phi / 2 + quarterPi), sinPhi0 = sin(phi);
  };

  // For subsequent points, …
  function nextPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    phi = phi / 2 + quarterPi; // half the angular distance from south pole

    // Spherical excess E for a spherical triangle with vertices: south pole,
    // previous point, current point.  Uses a formula derived from Cagnoli’s
    // theorem.  See Todhunter, Spherical Trig. (1871), Sec. 103, Eq. (2).
    var dLambda = lambda - lambda0,
        sdLambda = dLambda >= 0 ? 1 : -1,
        adLambda = sdLambda * dLambda,
        cosPhi = cos(phi),
        sinPhi = sin(phi),
        k = sinPhi0 * sinPhi,
        u = cosPhi0 * cosPhi + k * cos(adLambda),
        v = k * sdLambda * sin(adLambda);
    areaRingSum.add(atan2(v, u));

    // Advance the previous points.
    lambda0 = lambda, cosPhi0 = cosPhi, sinPhi0 = sinPhi;
  }

  // For the last point, return to the start.
  area.lineEnd = function() {
    nextPoint(lambda00, phi00);
  };
}

export default function(object) {
  areaSum = 0;
  stream(object, area);
  return areaSum;
}
