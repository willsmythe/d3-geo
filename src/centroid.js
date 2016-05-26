import {acos, asin, atan2, cos, degrees, radians, sin, sqrt} from "./math";
import noop from "./noop";
import geoStream from "./stream";

var centroidW0,
    centroidW1,
    centroidX0,
    centroidY0,
    centroidZ0,
    centroidX1,
    centroidY1,
    centroidZ1,
    centroidX2,
    centroidY2,
    centroidZ2;

var centroid = {
  sphere: noop,
  point: centroidPoint,
  lineStart: centroidLineStart,
  lineEnd: centroidLineEnd,
  polygonStart: function() {
    centroid.lineStart = centroidRingStart;
  },
  polygonEnd: function() {
    centroid.lineStart = centroidLineStart;
  }
};

// Arithmetic mean of Cartesian vectors.
function centroidPoint(lambda, phi) {
  lambda *= radians;
  var cosPhi = cos(phi *= radians);
  centroidPointXYZ(cosPhi * cos(lambda), cosPhi * sin(lambda), sin(phi));
}

function centroidPointXYZ(x, y, z) {
  ++centroidW0;
  centroidX0 += (x - centroidX0) / centroidW0;
  centroidY0 += (y - centroidY0) / centroidW0;
  centroidZ0 += (z - centroidZ0) / centroidW0;
}

function centroidLineStart() {
  var x0, y0, z0; // previous point

  centroid.point = function(lambda, phi) {
    lambda *= radians;
    var cosPhi = cos(phi *= radians);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi);
    centroid.point = nextPoint;
    centroidPointXYZ(x0, y0, z0);
  };

  function nextPoint(lambda, phi) {
    lambda *= radians;
    var cosPhi = cos(phi *= radians),
        x = cosPhi * cos(lambda),
        y = cosPhi * sin(lambda),
        z = sin(phi),
        w = atan2(
          sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w),
          x0 * x + y0 * y + z0 * z);
    centroidW1 += w;
    centroidX1 += w * (x0 + (x0 = x));
    centroidY1 += w * (y0 + (y0 = y));
    centroidZ1 += w * (z0 + (z0 = z));
    centroidPointXYZ(x0, y0, z0);
  }
}

function centroidLineEnd() {
  centroid.point = centroidPoint;
}

// See J. E. Brock, The Inertia Tensor for a Spherical Triangle,
// J. Applied Mechanics 42, 239 (1975).
function centroidRingStart() {
  var lambda00, phi00, // first point
      x0, y0, z0; // previous point

  centroid.point = function(lambda, phi) {
    lambda00 = lambda, phi00 = phi;
    centroid.point = nextPoint;
    lambda *= radians;
    var cosPhi = cos(phi *= radians);
    x0 = cosPhi * cos(lambda);
    y0 = cosPhi * sin(lambda);
    z0 = sin(phi);
    centroidPointXYZ(x0, y0, z0);
  };

  centroid.lineEnd = function() {
    nextPoint(lambda00, phi00);
    centroid.lineEnd = centroidLineEnd;
    centroid.point = centroidPoint;
  };

  function nextPoint(lambda, phi) {
    lambda *= radians;
    var cosPhi = cos(phi *= radians),
        x = cosPhi * cos(lambda),
        y = cosPhi * sin(lambda),
        z = sin(phi),
        cx = y0 * z - z0 * y,
        cy = z0 * x - x0 * z,
        cz = x0 * y - y0 * x,
        m = sqrt(cx * cx + cy * cy + cz * cz),
        u = x0 * x + y0 * y + z0 * z,
        v = m && -acos(u) / m, // area weight
        w = atan2(m, u); // line weight
    centroidX2 += v * cx;
    centroidY2 += v * cy;
    centroidZ2 += v * cz;
    centroidW1 += w;
    centroidX1 += w * (x0 + (x0 = x));
    centroidY1 += w * (y0 + (y0 = y));
    centroidZ1 += w * (z0 + (z0 = z));
    centroidPointXYZ(x0, y0, z0);
  }
}

export default function(object) {
  centroidW0 = centroidW1 =
  centroidX0 = centroidY0 = centroidZ0 =
  centroidX1 = centroidY1 = centroidZ1 =
  centroidX2 = centroidY2 = centroidZ2 = 0;
  geoStream(object, centroid);

  var x = centroidX2,
      y = centroidY2,
      z = centroidZ2,
      m = x * x + y * y + z * z;

  // If the area-weighted ccentroid is undefined, fall back to length-weighted ccentroid.
  if (m < 1e-12) {
    x = centroidX1, y = centroidY1, z = centroidZ1;
    // If the feature has zero length, fall back to arithmetic mean of point vectors.
    if (centroidW1 < 1e-6) x = centroidX0, y = centroidY0, z = centroidZ0;
    m = x * x + y * y + z * z;
    // If the feature still has an undefined ccentroid, then return.
    if (m < 1e-12) return [NaN, NaN];
  }

  return [atan2(y, x) * degrees, asin(z / sqrt(m)) * degrees];
}
