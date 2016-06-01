import {deg2rad} from "./math";
import noop from "./noop";
import stream from "./stream";

var sum;

var length = {
  sphere: noop,
  point: noop,
  lineStart: lineStart,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop
};

function lineStart() {
  var lambda0,
      sinPhi0,
      cosPhi0;

  length.point = function(lambda, phi) {
    lambda *= deg2rad, phi *= deg2rad;
    lambda0 = lambda, sinPhi0 = Math.sin(phi), cosPhi0 = Math.cos(phi);
    length.point = nextPoint;
  };

  length.lineEnd = function() {
    length.point = length.lineEnd = noop;
  };

  function nextPoint(lambda, phi) {
    lambda *= deg2rad, phi *= deg2rad;
    var sinPhi = Math.sin(phi),
        cosPhi = Math.cos(phi),
        delta = Math.abs(lambda - lambda0),
        cosDelta = Math.cos(delta),
        sinDelta = Math.sin(delta),
        t;
    sum += Math.atan2(
      Math.sqrt((t = cosPhi * sinDelta) * t + (t = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta) * t),
      sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta
    );
    lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
  }
}

export default function(object) {
  sum = 0;
  stream(object, length);
  return sum;
}
