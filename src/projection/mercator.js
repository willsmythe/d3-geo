import projection from "./index";
import {atan, exp, halfPi, log, pi, tan, tau} from "../math";

export function mercatorRaw(lambda, phi) {
  return [lambda, log(tan((halfPi + phi) / 2))];
}

mercatorRaw.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi];
};

export default function() {
  return mercatorProjection(mercatorRaw)
      .scale(961 / tau);
}

export function mercatorProjection(project) {
  var m = projection(project),
      scale = m.scale,
      translate = m.translate,
      clipExtent = m.clipExtent,
      x0 = null, y0, x1, y1; // clip extent

  m.scale = function(_) {
    return arguments.length ? (scale(_), reclip()) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), reclip()) : translate();
  };

  m.clipExtent = function(_) {
    if (!arguments.length) return x0 == null ? null : [[x0, y0], [x1, y1]];
    if (_ == null) x0 = y0 = x1 = y1 = null;
    else x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1];
    return reclip();
  };

  function reclip() {
    var k = pi * scale(),
        t = translate();
    return clipExtent(x0 == null
        ? [[t[0] - k, t[1] - k], [t[0] + k, t[1] + k]]
        : [[Math.max(t[0] - k, x0), y0], [Math.min(t[0] + k, x1), y1]]);
  }

  return reclip();
}
