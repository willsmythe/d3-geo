import {adder, atan2, cos, pi, radians, sin} from "./math";
import noop from "./noop";
import geoStream from "./stream";


var areaSum,
    areaRingSum = new adder;

var area = {
  sphere: function() { areaSum += 4 * pi; },
  point: noop,
  lineStart: noop,
  lineEnd: noop,

  // Only count area for polygon rings.
  polygonStart: function() {
    areaRingSum.reset();
    area.lineStart = areaRingStart;
  },
  polygonEnd: function() {
    var area = 2 * areaRingSum;
    areaSum += area < 0 ? 4 * pi + area : area;
    this.lineStart = this.lineEnd = this.point = noop;
  }
};

function areaRingStart() {
  var lambda00, phi00, lambda0, cosPhi0, sinPhi0; // start point and previous point

  // For the first point, …
  area.point = function(lambda, phi) {
    area.point = nextPoint;
    lambda0 = (lambda00 = lambda) * radians, cosPhi0 = cos(phi = (phi00 = phi) * radians / 2 + pi / 4), sinPhi0 = sin(phi);
  };

  // For subsequent points, …
  function nextPoint(lambda, phi) {
    lambda *= radians;
    phi = phi * radians / 2 + pi / 4; // half the angular distance from south pole

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
  geoStream(object, area);
  return areaSum;
}
