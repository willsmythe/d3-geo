import projection from "./index";
import {atan, exp, halfPi, log, tan} from "../math";

function mercator(lambda, phi) {
  return [lambda, log(tan((halfPi + phi) / 2))];
}

mercator.invert = function(x, y) {
  return [x, 2 * atan(exp(y)) - halfPi];
};

export default function() {
  return projection(mercator);
}
