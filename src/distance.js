import {deg2rad} from "./math";

// Length returned in radians; multiply by radius for distance.
export default function(a, b) {
  var deltaLambda = (b[0] - a[0]) * deg2rad,
      phi0 = a[1] * deg2rad, phi1 = b[1] * deg2rad,
      sinDeltaLambda = Math.sin(deltaLambda), cosDeltaLambda = Math.cos(deltaLambda),
      sinPhi0 = Math.sin(phi0), cosPhi0 = Math.cos(phi0),
      sinPhi1 = Math.sin(phi1), cosPhi1 = Math.cos(phi1),
      t;
  return Math.atan2(
    Math.sqrt((t = cosPhi1 * sinDeltaLambda) * t + (t = cosPhi0 * sinPhi1 - sinPhi0 * cosPhi1 * cosDeltaLambda) * t), 
    sinPhi0 * sinPhi1 + cosPhi0 * cosPhi1 * cosDeltaLambda);
}
