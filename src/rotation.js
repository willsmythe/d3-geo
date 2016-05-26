import compose from "./compose";
import {deg2rad, rad2deg} from "./math";

function identityRotation(lambda, phi) {
  return [lambda > Math.PI ? lambda - 2*Math.PI : lambda < -Math.PI ? lambda + 2*Math.PI : lambda, phi];
}

identityRotation.invert = identityRotation;

// Note: |deltaLambda| must be < 2pi
function rotation(deltaLambda, deltaPhi, deltaGamma) {
  return deltaLambda ? (deltaPhi || deltaGamma ? compose(rotationLambda(deltaLambda), rotationPhiGamma(deltaPhi, deltaGamma))
    : rotationLambda(deltaLambda))
    : (deltaPhi || deltaGamma ? rotationPhiGamma(deltaPhi, deltaGamma)
    : identityRotation);
}

function forwardRotationLambda(deltaLambda) {
  return function(lambda, phi) {
    return lambda += deltaLambda, [lambda > Math.PI ? lambda - 2*Math.PI : lambda < -Math.PI ? lambda + 2*Math.PI : lambda, phi];
  };
}

function rotationLambda(deltaLambda) {
  var rotation = forwardRotationLambda(deltaLambda);
  rotation.invert = forwardRotationLambda(-deltaLambda);
  return rotation;
}

function rotationPhiGamma(deltaPhi, deltaGamma) {
  var cosDeltaPhi = Math.cos(deltaPhi),
      sinDeltaPhi = Math.sin(deltaPhi),
      cosDeltaGamma = Math.cos(deltaGamma),
      sinDeltaGamma = Math.sin(deltaGamma);

  function rotation(lambda, phi) {
    var cosPhi = Math.cos(phi),
        x = Math.cos(lambda) * cosPhi,
        y = Math.sin(lambda) * cosPhi,
        z = Math.sin(phi),
        k = z * cosDeltaPhi + x * sinDeltaPhi;
    return [
      Math.atan2(y * cosDeltaGamma - k * sinDeltaGamma, x * cosDeltaPhi - z * sinDeltaPhi),
      Math.asin(k * cosDeltaGamma + y * sinDeltaGamma)
    ];
  }

  rotation.invert = function(lambda, phi) {
    var cosPhi = Math.cos(phi),
        x = Math.cos(lambda) * cosPhi,
        y = Math.sin(lambda) * cosPhi,
        z = Math.sin(phi),
        k = z * cosDeltaGamma - y * sinDeltaGamma;
    return [
      Math.atan2(y * cosDeltaGamma + z * sinDeltaGamma, x * cosDeltaPhi + k * sinDeltaPhi),
      Math.asin(k * cosDeltaPhi - x * sinDeltaPhi)
    ];
  };

  return rotation;
}

export default function(rotate) {
  rotate = rotation(rotate[0] % 360 * deg2rad, rotate[1] * deg2rad, rotate.length > 2 ? rotate[2] * deg2rad : 0);

  function forward(coordinates) {
    coordinates = rotate(coordinates[0] * deg2rad, coordinates[1] * deg2rad);
    return coordinates[0] *= rad2deg, coordinates[1] *= rad2deg, coordinates;
  }

  forward.invert = function(coordinates) {
    coordinates = rotate.invert(coordinates[0] * deg2rad, coordinates[1] * deg2rad);
    return coordinates[0] *= rad2deg, coordinates[1] *= rad2deg, coordinates;
  };

  return forward;
}
