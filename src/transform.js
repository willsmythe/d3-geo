export default function(methods) {
  return {
    stream: transform(methods)
  };
}

export function transform(methods) {
  return function(stream) {
    var t = new Transform;
    for (var key in methods) t[key] = methods[key];
    t.stream = stream;
    return t;
  };
}

function Transform() {}

Transform.prototype = {
  constructor: Transform,
  point: function(x, y) { this.stream.point(x, y); },
  sphere: function() { this.stream.sphere(); },
  lineStart: function() { this.stream.lineStart(); },
  lineEnd: function() { this.stream.lineEnd(); },
  polygonStart: function() { this.stream.polygonStart(); },
  polygonEnd: function() { this.stream.polygonEnd(); }
};
