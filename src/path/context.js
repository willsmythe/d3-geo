import {tau} from "../math";
import noop from "../noop";

export default function(context) {
  var pointRadius = 4.5;

  var sink = {
    point: point,

    // While inside a line, override point to moveTo then lineTo.
    lineStart: function() { sink.point = pointLineStart; },
    lineEnd: lineEnd,

    // While inside a polygon, override lineEnd to closePath.
    polygonStart: function() { sink.lineEnd = lineEndPolygon; },
    polygonEnd: function() { sink.lineEnd = lineEnd; sink.point = point; },

    pointRadius: function(_) {
      pointRadius = _;
      return sink;
    },

    result: noop
  };

  function point(x, y) {
    context.moveTo(x + pointRadius, y);
    context.arc(x, y, pointRadius, 0, tau);
  }

  function pointLineStart(x, y) {
    context.moveTo(x, y);
    sink.point = pointLine;
  }

  function pointLine(x, y) {
    context.lineTo(x, y);
  }

  function lineEnd() {
    sink.point = point;
  }

  function lineEndPolygon() {
    context.closePath();
  }

  return sink;
}
