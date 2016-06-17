import clipAntimeridian from "./clip-antimeridian";
import compose from "./compose";
import identity from "./identity";
import {degrees, radians} from "./math";
import resample from "./resample";
import {rotation} from "./rotation";
import transform from "./transform";

var transformRadians = transform({
  point: function(x, y) {
    this.stream.point(x * radians, y * radians);
  }
});

export default function projection(project) {
  return projectionMutator(function() { return project; })();
}

export function projectionMutator(projectAt) {
  var project,
      rotate,
      projectRotate,
      projectResample = resample(projectTransform),
      k = 150, // scale
      x = 480, y = 250, // translate
      dx, dy, // center
      lambda = 0, phi = 0, // center
      deltaLambda = 0, deltaPhi = 0, deltaGamma = 0, // rotate
      preclip = clipAntimeridian,
      postclip = identity,
      // clipAngle = null,
      // clipExtent = null,
      stream,
      streamSink;

  function projection(point) {
    point = projectRotate(point[0] * radians, point[1] * radians);
    return [point[0] * k + dx, dy - point[1] * k];
  }

  function invert(point) {
    point = projectRotate.invert((point[0] - dx) / k, (dy - point[1]) / k);
    return point && [point[0] * degrees, point[1] * degrees];
  }

  function projectTransform(x, y) {
    x = project(x, y);
    return [x[0] * k + dx, dy - x[1] * k];
  }

  projection.stream = function(sink) {
    return stream && streamSink === sink ? stream : stream = transformRadians(preclip(rotate, projectResample(postclip(streamSink = sink))));
  };

  // TODO
  // projection.clipAngle = function(_) {
  //   if (!arguments.length) return clipAngle;
  //   preclip = _ == null ? (clipAngle = _, clipAntimeridian) : clipCircle((clipAngle = +_) * radians);
  //   return invalidate();
  // };

  // TODO
  // projection.clipExtent = function(_) {
  //   if (!arguments.length) return clipExtent;
  //   clipExtent = _;
  //   postclip = _ ? clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : identity;
  //   return invalidate();
  // };

  projection.scale = function(_) {
    if (!arguments.length) return k;
    k = +_;
    return reset();
  };

  projection.translate = function(_) {
    if (!arguments.length) return [x, y];
    x = +_[0];
    y = +_[1];
    return reset();
  };

  projection.center = function(_) {
    if (!arguments.length) return [lambda * degrees, phi * degrees];
    lambda = _[0] % 360 * radians;
    phi = _[1] % 360 * radians;
    return reset();
  };

  projection.rotate = function(_) {
    if (!arguments.length) return [deltaLambda * degrees, deltaPhi * degrees, deltaGamma * degrees];
    deltaLambda = _[0] % 360 * radians;
    deltaPhi = _[1] % 360 * radians;
    deltaGamma = _.length > 2 ? _[2] % 360 * radians : 0;
    return reset();
  };

  projection.precision = function() {
    var result = projectResample.precision.apply(projectResample, arguments);
    return result === projectResample ? projection : result;
  };

  function reset() {
    projectRotate = compose(rotate = rotation(deltaLambda, deltaPhi, deltaGamma), project);
    var center = project(lambda, phi);
    dx = x - center[0] * k;
    dy = y + center[1] * k;
    return invalidate();
  }

  function invalidate() {
    stream = streamSink = null;
    return projection;
  }

  return function() {
    project = projectAt.apply(this, arguments);
    projection.invert = project.invert && invert;
    return reset();
  };
}
