var tape = require("tape"),
    d3 = require("../../");

require("./projectionEqual");

var pi = Math.PI;

tape("projection.invert(projection(point)) returns the point", function(test) {
  [
    d3.geoAlbers(),
    /* d3.geoAlbersUsa(), */
    d3.geoAzimuthalEqualArea(),
    d3.geoAzimuthalEquidistant(),
    d3.geoConicConformal(),
    d3.geoConicConformal().parallels([20,30]),
    d3.geoConicConformal().parallels([30,30]),
    d3.geoConicConformal().parallels([-35,-50]),
    d3.geoConicEqualArea(),
    d3.geoConicEqualArea().parallels([20,30]),
    d3.geoConicEqualArea().parallels([-30,30]),
    d3.geoConicEqualArea().parallels([-35,-50]), // https://github.com/d3/d3/issues/2707
    d3.geoConicEquidistant(),
    d3.geoConicEquidistant().parallels([20,30]),
    d3.geoConicEquidistant().parallels([30,30]),
    d3.geoConicEquidistant().parallels([-35,-50]),
    d3.geoEquirectangular(),
    d3.geoGnomonic(),
    d3.geoMercator(),
    d3.geoOrthographic(),
    d3.geoStereographic(),
    d3.geoTransverseMercator(),
  ]
  .forEach(function(projection) {
     [ [0, 0], [30, 24], [ -10, 42 ] ]
     .forEach(function(point) {
         test.projectionEqual(projection, point, projection(point));
     });
  });
  test.end();
});