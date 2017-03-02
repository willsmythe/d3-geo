var tape = require("tape"),
    d3 = require("../../");

require("../pathEqual");

tape("mercator.clipExtent(null) sets the default automatic clip extent", function(test) {
  var mercator = d3.geoMercator().translate([0, 0]).scale(1).clipExtent(null).precision(0);
  test.pathEqual(d3.geoPath(mercator)({type: "Sphere"}), "M3.141593,-3.141593L3.141593,0L3.141593,3.141593L3.141593,3.141593L-3.141593,3.141593L-3.141593,3.141593L-3.141593,0L-3.141593,-3.141593L-3.141593,-3.141593L3.141593,-3.141593Z");
  test.equal(mercator.clipExtent(), null);
  test.end();
});

tape("mercator.clipExtent(extent) intersects the specified clip extent with the automatic clip extent", function(test) {
  var mercator = d3.geoMercator().translate([0, 0]).scale(1).clipExtent([[-10, -10], [10, 10]]).precision(0);
  test.pathEqual(d3.geoPath(mercator)({type: "Sphere"}), "M3.141593,-10L3.141593,0L3.141593,10L3.141593,10L-3.141593,10L-3.141593,10L-3.141593,0L-3.141593,-10L-3.141593,-10L3.141593,-10Z");
  test.deepEqual(mercator.clipExtent(), [[-10, -10], [10, 10]]);
  test.end();
});

tape("mercator.clipExtent(extent).scale(scale) updates the intersected clip extent", function(test) {
  var mercator = d3.geoMercator().translate([0, 0]).clipExtent([[-10, -10], [10, 10]]).scale(1).precision(0);
  test.pathEqual(d3.geoPath(mercator)({type: "Sphere"}), "M3.141593,-10L3.141593,0L3.141593,10L3.141593,10L-3.141593,10L-3.141593,10L-3.141593,0L-3.141593,-10L-3.141593,-10L3.141593,-10Z");
  test.deepEqual(mercator.clipExtent(), [[-10, -10], [10, 10]]);
  test.end();
});

tape("mercator.clipExtent(extent).translate(translate) updates the intersected clip extent", function(test) {
  var mercator = d3.geoMercator().scale(1).clipExtent([[-10, -10], [10, 10]]).translate([0, 0]).precision(0);
  test.pathEqual(d3.geoPath(mercator)({type: "Sphere"}), "M3.141593,-10L3.141593,0L3.141593,10L3.141593,10L-3.141593,10L-3.141593,10L-3.141593,0L-3.141593,-10L-3.141593,-10L3.141593,-10Z");
  test.deepEqual(mercator.clipExtent(), [[-10, -10], [10, 10]]);
  test.end();
});
