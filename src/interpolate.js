import {deg2rad, rad2deg, haversin} from "./math";

function interpolate(x0, y0, x1, y1) {
  var cy0 = Math.cos(y0),
      sy0 = Math.sin(y0),
      cy1 = Math.cos(y1),
      sy1 = Math.sin(y1),
      kx0 = cy0 * Math.cos(x0),
      ky0 = cy0 * Math.sin(x0),
      kx1 = cy1 * Math.cos(x1),
      ky1 = cy1 * Math.sin(x1),
      d = 2 * Math.asin(Math.sqrt(haversin(y1 - y0) + cy0 * cy1 * haversin(x1 - x0))),
      k = 1 / Math.sin(d);

  var interpolate = d ? function(t) {
    t *= d;
    var B = Math.sin(t) * k,
        A = Math.sin(d - t) * k,
        x = A * kx0 + B * kx1,
        y = A * ky0 + B * ky1,
        z = A * sy0 + B * sy1;
    return [
      Math.atan2(y, x) * rad2deg,
      Math.atan2(z, Math.sqrt(x * x + y * y)) * rad2deg
    ];
  } : function() { return [x0 * rad2deg, y0 * rad2deg]; };

  interpolate.distance = d;

  return interpolate;
}

export default function(source, target) {
  return interpolate(
    source[0] * deg2rad, source[1] * deg2rad,
    target[0] * deg2rad, target[1] * deg2rad
  );
}
