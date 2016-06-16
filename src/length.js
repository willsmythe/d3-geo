import adder from "./adder";
import {abs, atan2, cos, radians, sin, sqrt} from "./math";
import noop from "./noop";
import stream from "./stream";

var lengthSum;

var lengthSink = {
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

  lengthSink.point = function(lambda, phi) {
    lambda *= radians, phi *= radians;
    lambda0 = lambda, sinPhi0 = sin(phi), cosPhi0 = cos(phi);
    lengthSink.point = nextPoint;
  };

  lengthSink.lineEnd = function() {
    lengthSink.point = lengthSink.lineEnd = noop;
  };

  function nextPoint(lambda, phi) {
    lambda *= radians, phi *= radians;
    var sinPhi = sin(phi),
        cosPhi = cos(phi),
        delta = abs(lambda - lambda0),
        cosDelta = cos(delta),
        sinDelta = sin(delta),
        t;
    lengthSum.add(atan2(
      sqrt((t = cosPhi * sinDelta) * t + (t = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta) * t),
      sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta
    ));
    lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
  }
}

export default function(object) {
  if (lengthSum) lengthSum.reset();
  else lengthSum = adder();
  stream(object, lengthSink);
  return +lengthSum;
}
