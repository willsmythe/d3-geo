import projection from "./index";
import {pi, halfPi} from "../math";

function mercator(lambda, phi) {
  return [lambda, Math.log(Math.tan(pi / 4 + phi / 2))];
}

mercator.invert = function(x, y) {
  return [x, 2 * Math.atan(Math.exp(y)) - halfPi];
};

export default function() {
  return projection(mercator);
}
