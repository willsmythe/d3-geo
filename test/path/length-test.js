var tape = require("tape"),
    d3_geo = require("../../");

tape("geoPath.length(…) of a Point", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "Point",
    coordinates: [0, 0]
  }), 0);
  test.end();
});

tape("geoPath.length(…) of a MultiPoint", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "Point",
    coordinates: [[0, 0], [0, 1], [1, 1], [1, 0]]
  }), 0);
  test.end();
});

tape("geoPath.length(…) of a LineString", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "LineString",
    coordinates: [[0, 0], [0, 1], [1, 1], [1, 0]]
  }), 3);
  test.end();
});

tape("geoPath.length(…) of a MultiLineString", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "MultiLineString",
    coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0]]]
  }), 3);
  test.end();
});

tape("geoPath.length(…) of a Polygon", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "Polygon",
    coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]
  }), 4);
  test.end();
});

tape("geoPath.length(…) of a Polygon with a hole", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "Polygon",
    coordinates: [[[-1, -1], [-1, 2], [2, 2], [2, -1], [-1, -1]], [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
  }), 16);
  test.end();
});

tape("geoPath.length(…) of a MultiPolygon", function(test) {
  test.equal(d3_geo.geoPath().length({
    type: "MultiPolygon",
    coordinates: [[[[-1, -1], [-1, 2], [2, 2], [2, -1], [-1, -1]]], [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]]
  }), 16);
  test.end();
});
