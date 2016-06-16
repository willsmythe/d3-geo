import {radians} from "./math";

export function transformPoint(stream, point) {
  return {
    point: point,
    sphere: function() { stream.sphere(); },
    lineStart: function() { stream.lineStart(); },
    lineEnd: function() { stream.lineEnd(); },
    polygonStart: function() { stream.polygonStart(); },
    polygonEnd: function() { stream.polygonEnd(); }
  };
}

export function transformRadians(stream) {
  return transformPoint(stream, function(x, y) {
    stream.point(x * radians, y * radians);
  });
}
