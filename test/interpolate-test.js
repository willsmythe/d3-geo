var tape = require("tape"),
    d3 = require("../");

require("./inDelta");

tape("geoInterpolate(a, a) returns a", function(test) {
  test.deepEqual(d3.geoInterpolate([140.63289, -29.95101], [140.63289, -29.95101])(0.5), [140.63289, -29.95101]);
  test.end();
});

tape("geoInterpolate(a, b) returns the expected values when a and b lie on the equator", function(test) {
  test.inDelta(d3.geoInterpolate([10, 0], [20, 0])(0.5)[0], 15, 1e-6);
  test.inDelta(d3.geoInterpolate([10, 0], [20, 0])(0.5)[1], 0, 1e-6);
  test.end();
});

tape("geoInterpolate(a, b) returns the expected values when a and b lie on a meridian", function(test) {
  test.inDelta(d3.geoInterpolate([10, -20], [10, 40])(0.5)[0], 10, 1e-6);
  test.inDelta(d3.geoInterpolate([10, -20], [10, 40])(0.5)[1], 10, 1e-6);
  test.end();
});
