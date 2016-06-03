import {cartesian, cartesianNormalize} from "./cartesian";
import {acos, asin, cos, degrees, radians, pi, sin, tau} from "./math";
import {rotation} from "./rotation";
import {spherical} from "./spherical";

// Interpolates along a circle centered at [0°, 0°], with a given radius and
// precision.
function circleInterpolate(radius, precision) {
  var cosRadius = cos(radius),
      sinRadius = sin(radius);
  return function(from, to, direction, listener) {
    var step = direction * precision;
    if (from != null) {
      from = circleRadius(cosRadius, from);
      to = circleRadius(cosRadius, to);
      if (direction > 0 ? from < to: from > to) from += direction * tau;
    } else {
      from = radius + direction * tau;
      to = radius - 0.5 * step;
    }
    for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
      listener.point((point = spherical([
        cosRadius,
        -sinRadius * cos(t),
        -sinRadius * sin(t)
      ]))[0], point[1]);
    }
  };
}

// Signed angle of a cartesian point relative to [cosRadius, 0, 0].
function circleRadius(cosRadius, point) {
  var r = cartesian(point);
  r[0] -= cosRadius;
  cartesianNormalize(r);
  var radius = acos(-r[1]);
  return ((-r[2] < 0 ? -radius : radius) + 2 * pi - 1e-6) % (2 * pi);
}

export default function() {
  var center = [0, 0],
      radius,
      precision = 6,
      interpolate;

  function circle() {
    var c = typeof center === "function" ? center.apply(this, arguments) : center,
        rotate = rotation(-c[0] * radians, -center[1] * radians, 0).invert,
        ring = [];

    interpolate(null, null, 1, {
      point: function(x, y) {
        ring.push(x = rotate(x, y));
        x[0] *= degrees, x[1] *= degrees;
      }
    });

    return {type: "Polygon", coordinates: [ring]};
  }

  circle.center = function(x) {
    if (!arguments.length) return center;
    center = x;
    return circle;
  };

  circle.radius = function(x) {
    if (!arguments.length) return radius;
    radius = +x;
    interpolate = circleInterpolate((radius = +x) * radians, precision * radians);
    return circle;
  };

  circle.precision = function(_) {
    if (!arguments.length) return precision;
    interpolate = circleInterpolate(radius * radians, (precision = +_) * radians);
    return circle;
  };

  return circle.radius(90);
}
