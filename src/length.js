import {deg2rad} from "./math";
import noop from "./noop";
import geoStream from "./stream";

var lengthSum;

var length = {
  sphere: noop,
  point: noop,
  lineStart: lengthLineStart,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop
};

function lengthLineStart() {
  var lambda0, sinPhi0, cosPhi0;

  length.point = function(lambda, phi) {
    lambda0 = lambda * deg2rad, sinPhi0 = Math.sin(phi *= deg2rad), cosPhi0 = Math.cos(phi);
    length.point = nextPoint;
  };

  length.lineEnd = function() {
    length.point = length.lineEnd = noop;
  };

  function nextPoint(lambda, phi) {
    var sinPhi = Math.sin(phi *= deg2rad),
        cosPhi = Math.cos(phi),
        t = Math.abs((lambda *= deg2rad) - lambda0),
        cosDeltaLambda = Math.cos(t);
    lengthSum += Math.atan2(
      Math.sqrt((t = cosPhi * Math.sin(t)) * t + (t = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDeltaLambda) * t), 
      sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDeltaLambda);
    lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
  }
}

export default function(object) {
  lengthSum = 0;
  geoStream(object, length);
  return lengthSum;
}
