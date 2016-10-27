import {transform} from "../transform";
import {fitExtent, fitSize} from "./fit";

export default function() {
  var k = 1, // scale
      dx = 0, dy = 0, // translate
      cache,
      cacheStream,
      identityTransform = transform({point: function(x, y) { this.stream.point(x * k + dx, y * k + dy); }});

  function projection(point) {
    return [point[0] * k + dx, point[1] * k + dy];
  }

  projection.invert = function(point) {
    return [(point[0] - dx) / k, (point[1] - dy) / k];
  };

  projection.stream = function(stream) {
    return cache && cacheStream === stream ? cache : cache = identityTransform(cacheStream = stream);
  };

  projection.scale = function(_) {
    return arguments.length ? (k = +_, reset()) : k;
  };

  projection.translate = function(_) {
    return arguments.length ? (dx = +_[0], dy = +_[1], reset()) : [dx, dy];
  };

  projection.fitExtent = fitExtent(projection);

  projection.fitSize = fitSize(projection);

  function reset() {
    cache = cacheStream = null;
    return projection;
  }

  return reset();
}
