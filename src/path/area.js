import adder from "../adder";
import {abs} from "../math";
import noop from "../noop";

var areaSum = adder(),
    areaRingSum = adder(),
    x00,
    y00,
    x0,
    y0;

var areaSink = {
  point: noop,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: function() {
    areaSink.lineStart = areaRingStart;
    areaSink.lineEnd = areaRingEnd;
  },
  polygonEnd: function() {
    areaSink.lineStart = areaSink.lineEnd = areaSink.point = noop;
    areaSum.add(abs(areaRingSum));
    areaRingSum.reset();
  },
  result: function() {
    var area = areaSum / 2;
    areaSum.reset();
    return area;
  }
};

function areaRingStart() {
  areaSink.point = areaPointFirst;
}

function areaPointFirst(x, y) {
  areaSink.point = areaPoint;
  x00 = x0 = x, y00 = y0 = y;
}

function areaPoint(x, y) {
  areaRingSum.add(y0 * x - x0 * y);
  x0 = x, y0 = y;
}

function areaRingEnd() {
  areaPoint(x00, y00);
}

export default areaSink;
