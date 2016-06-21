export default function(prototype) {
  return {
    stream: transform(prototype)
  };
}

export function transform(prototype) {
  function T() {}
  var p = T.prototype = Object.create(Transform.prototype);
  for (var k in prototype) p[k] = prototype[k];
  return function(next) {
    var t = new T;
    t.next = next;
    return t;
  };
}

function Transform() {}

Transform.prototype = {
  point: function(x, y) { this.next.point(x, y); },
  sphere: function() { this.next.sphere(); },
  lineStart: function() { this.next.lineStart(); },
  lineEnd: function() { this.next.lineEnd(); },
  polygonStart: function() { this.next.polygonStart(); },
  polygonEnd: function() { this.next.polygonEnd(); }
};
