import {cartesian, cartesianNormalizeInPlace} from "./cartesian";
import constant from "./constant";
import {acos, cos, degrees, epsilon, halfPi, radians, sin, tau} from "./math";
import {rotation} from "./rotation";
import {spherical} from "./spherical";

// Generates a circle centered at [0°, 0°], with a given radius and precision.
function circleStream(radius, precision) {
  var cosRadius = cos(radius),
      sinRadius = sin(radius);
  return function(from, to, direction, listener) {
    var step = direction * precision;
    if (from != null) {
      from = circleRadius(cosRadius, from);
      to = circleRadius(cosRadius, to);
      if (direction > 0 ? from < to : from > to) from += direction * tau;
    } else {
      from = radius + direction * tau;
      to = radius - 0.5 * step;
    }
    for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
      point = spherical([cosRadius, -sinRadius * cos(t), -sinRadius * sin(t)]);
      listener.point(point[0], point[1]);
    }
  };
}

// Returns the signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  point = cartesian(point), point[0] -= cosRadius;
  cartesianNormalizeInPlace(point);
  var radius = acos(-point[1]);
  return ((-point[2] < 0 ? -radius : radius) + tau - epsilon) % tau;
}

var defaultCenter = constant([0, 0]);

export default function() {
  var center = defaultCenter,
      radius = halfPi,
      precision = 6 * radians,
      stream = circleStream(radius, precision);

  function circle() {
    var c = center.apply(this, arguments),
        rotate = rotation(-c[0] * radians % tau, -c[1] * radians, 0).invert,
        ring = [];

    stream(null, null, 1, {
      point: function(x, y) {
        ring.push(x = rotate(x, y));
        x[0] *= degrees, x[1] *= degrees;
      }
    });

    return {type: "Polygon", coordinates: [ring]};
  }

  circle.center = function(_) {
    return arguments.length ? (center = typeof _ === "function" ? _ : constant([+_[0], +_[1]]), circle) : center;
  };

  circle.radius = function(_) {
    return arguments.length ? (stream = circleStream(radius = _ * radians, precision), circle) : radius * degrees;
  };

  circle.precision = function(_) {
    return arguments.length ? (stream = circleStream(radius, precision = _ * radians), circle) : precision * degrees;
  };

  return circle;
}
