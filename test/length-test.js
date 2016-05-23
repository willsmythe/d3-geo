var tape = require("tape"),
  d3 = require("../"),
  inDelta = require("./inDelta");

tape("the length of points are zero", function(test) {
  test.assert(inDelta(d3.geoLength({type: "Point", coordinates: [0, 0]}), 0, 1e-6));
  test.assert(inDelta(d3.geoLength({type: "MultiPoint", coordinates: [[0, 1], [2, 3]]}), 0, 1e-6));
  test.end();
});

tape("the length of a line string is the sum of its great arc segments", function(test) {
  test.assert(inDelta(d3.geoLength({type: "LineString", coordinates: [[-45, 0], [45, 0]]}), Math.PI / 2, 1e-6));
  test.assert(inDelta(d3.geoLength({type: "LineString", coordinates: [[-45, 0], [-30, 0], [-15, 0], [0, 0]]}), Math.PI / 4, 1e-6));
  test.assert(inDelta(d3.geoLength({type: "MultiLineString", coordinates: [[[-45, 0], [-30, 0]], [[-15, 0], [0, 0]]]}), Math.PI / 6, 1e-6));
  test.end();
});

tape("the length of a polygon is its perimeter", function(test) {
  test.assert(inDelta(d3.geoLength({type: "Polygon", coordinates: [[[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]]}), 0.157008, 1e-6));
  test.assert(inDelta(d3.geoLength({type: "MultiPolygon", coordinates: [[[[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]]]}), 0.157008, 1e-6));
  test.assert(inDelta(d3.geoLength({type: "MultiPolygon", coordinates: [[[[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]]], [[[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]]]}), 0.209354, 1e-6));
  test.end();
});

tape("the length of a polygon is its perimeter, including holes", function(test) {
  test.assert(inDelta(d3.geoLength({type: "Polygon", coordinates: [[[0, 0], [3, 0], [3, 3], [0, 3], [0, 0]], [[1, 1], [2, 1], [2, 2], [1, 2], [1, 1]]]}), 0.209354, 1e-6));
  test.end();
});

tape("the length of a feature collection is the sum of its features", function(test) {
  test.assert(inDelta(d3.geoLength({
    type: "FeatureCollection", features: [
      {type: "Feature", geometry: {type: "LineString", coordinates: [[-45, 0], [0, 0]]}},
      {type: "Feature", geometry: {type: "LineString", coordinates: [[0, 0], [45, 0]]}}
    ]
 }), Math.PI / 2, 1e-6));
  test.end();
});

tape("the length of a geometry collection is the sum of its geometries", function(test) {
  test.assert(inDelta(d3.geoLength({
    type: "GeometryCollection", geometries: [
      {type: "GeometryCollection", geometries: [{type: "LineString", coordinates: [[-45, 0], [0, 0]]}]},
      {type: "LineString", coordinates: [[0, 0], [45, 0]]}
    ]
 }), Math.PI / 2, 1e-6));
  test.end();
});
