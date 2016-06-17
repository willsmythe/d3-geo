export default function() {
  var pointCircle = circle(4.5),
      string = [];

  var sink = {
    point: point,
    lineStart: lineStart,
    lineEnd: lineEnd,
    polygonStart: function() {
      sink.lineEnd = lineEndPolygon;
    },
    polygonEnd: function() {
      sink.lineEnd = lineEnd;
      sink.point = point;
    },
    pointRadius: function(_) {
      pointCircle = circle(_);
      return sink;
    },
    result: function() {
      if (string.length) {
        var result = string.join("");
        string = [];
        return result;
      }
    }
  };

  function point(x, y) {
    string.push("M", x, ",", y, pointCircle);
  }

  function pointLineStart(x, y) {
    string.push("M", x, ",", y);
    sink.point = pointLine;
  }

  function pointLine(x, y) {
    string.push("L", x, ",", y);
  }

  function lineStart() {
    sink.point = pointLineStart;
  }

  function lineEnd() {
    sink.point = point;
  }

  function lineEndPolygon() {
    string.push("Z");
  }

  return sink;
}

function circle(radius) {
  return "m0," + radius
      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
      + "z";
}
