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
      clipAuto;

  m.scale = function(_) {
    return arguments.length ? (scale(_), clipAuto ? m.clipExtent(null) : m) : scale();
  };

  m.translate = function(_) {
    return arguments.length ? (translate(_), clipAuto ? m.clipExtent(null) : m) : translate();
  };

  m.clipExtent = function(_) {
    if (!arguments.length) return clipAuto ? null : clipExtent();
    var k = pi * scale(),
        t = translate(),
        x0 = t[0] - k,
        x1 = t[0] + k;
    return clipExtent(clipAuto = _ == null
        ? [[x0, t[1] - k], [x1, t[1] + k]]
        : [[Math.max(x0, +_[0][0]), _[0][1]], [Math.min(x1, +_[1][0]), _[1][1]]]);
  };

  return m.clipExtent(null);
}
