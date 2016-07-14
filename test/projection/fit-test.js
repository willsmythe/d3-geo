var tape = require("tape"),
    topojson = require("topojson"),
    d3 = require("../../");

var usTopo = require("../data/us-10m.json"),
    us = topojson.feature(usTopo, usTopo.objects.land),
    worldTopo = require("../data/world-50m.json"),
    world = topojson.feature(worldTopo, worldTopo.objects.land);

require("../inDelta");

tape("fitExtent: world equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 491.999512], 1e-6);
  test.end();

});

tape("fitExtent: world azimuthalEqualArea", function(test){

  var projection = d3.geoAzimuthalEqualArea();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 228.357167, 1e-6);
  test.inDelta(projection.translate(), [496.353437, 479.684335], 1e-6);
  test.end();

});

tape("fitExtent: world azimuthalEquidistant", function(test){

  var projection = d3.geoAzimuthalEquidistant();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 153.559157, 1e-6);
  test.inDelta(projection.translate(), [485.272655, 452.093361], 1e-6);
  test.end();

});

tape("fitExtent: world conicConformal", function(test){

  var projection = d3.geoConicConformal()
      .clipAngle(30)
      .parallels([30, 60])
      .rotate([0, -45]);

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 626.111017, 1e-6);
  test.inDelta(projection.translate(), [444.395872, 410.223792], 1e-6);
  test.end();

});

tape("fitExtent: world conicEqualArea", function(test){

  var projection = d3.geoConicEqualArea();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 145.862346, 1e-6);
  test.inDelta(projection.translate(), [500, 591.911769], 1e-6);
  test.end();

});

tape("fitExtent: world conicEquidistant", function(test){

  var projection = d3.geoConicEquidistant();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 123.085, 1e-6);
  test.inDelta(projection.translate(), [500, 528.541415], 1e-6);
  test.end();

});

tape("fitExtent: world equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 491.999512], 1e-6);
  test.end();

});

tape("fitSize: world equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fitSize([900, 900], world);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [450, 441.999512], 1e-6);
  test.end();

});

tape("fitExtent: world gnomonic", function(test){

  var projection = d3.geoGnomonic()
      .clipAngle(45);

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 450.348236, 1e-6);
  test.inDelta(projection.translate(), [500.115152, 556.52294], 1e-6);
  test.end();

});

tape("fitExtent: world mercator", function(test){

  var projection = d3.geoMercator();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 481.549457], 1e-6);
  test.end();

});

tape("fitExtent: world orthographic", function(test){

  var projection = d3.geoOrthographic();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 451.428643, 1e-6);
  test.inDelta(projection.translate(), [503.769378, 498.61496], 1e-6);
  test.end();

});

tape("fitSize: world orthographic", function(test){

  var projection = d3.geoOrthographic();

  projection.fitSize([900, 900], world);

  test.inDelta(projection.scale(), 451.428643, 1e-6);
  test.inDelta(projection.translate(), [453.769378, 448.61496], 1e-6);
  test.end();

});

tape("fitExtent: world stereographic", function(test){

  var projection = d3.geoStereographic();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 162.934518, 1e-6);
  test.inDelta(projection.translate(), [478.546849, 432.922426], 1e-6);
  test.end();

});

tape("fitExtent: world transverseMercator", function(test){

  var projection = d3.geoTransverseMercator();

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [473.829753, 500], 1e-6);
  test.end();

});

tape("fitExtent: USA albersUsa", function(test){

  var projection = d3.geoAlbersUsa();

  projection.fitExtent([[50, 50], [950, 950]], us);

  test.inDelta(projection.scale(), 1152.889035, 1e-6);
  test.inDelta(projection.translate(), [533.52541, 496.232028], 1e-6);
  test.end();

});

tape("fitExtent: null geometries - Feature", function(test) {

  var proj = d3.geoEquirectangular();

  proj.fitExtent([[50, 50], [950, 950]], {type: "Feature", geometry: null});

  var s = proj.scale(),
      t = proj.translate();

  test.assert(!s);
  test.assert(isNaN(t[0]));
  test.assert(isNaN(t[1]));
  test.end();

});

tape("fitExtent: null geometries - MultiPoint", function(test) {

  var proj = d3.geoEquirectangular();

  proj.fitExtent([[50, 50], [950, 950]], {type: "MultiPoint", coordinates: []});

  var s = proj.scale(),
      t = proj.translate();

  test.assert(!s);
  test.assert(isNaN(t[0]));
  test.assert(isNaN(t[1]));
  test.end();

});

tape("fitExtent: null geometries - MultiLineString", function(test) {

  var proj = d3.geoEquirectangular();

  proj.fitExtent([[50, 50], [950, 950]], {type: "MultiLineString", coordinates: []});

  var s = proj.scale(),
      t = proj.translate();

  test.assert(!s);
  test.assert(isNaN(t[0]));
  test.assert(isNaN(t[1]));
  test.end();

});

tape("fitExtent: null geometries - MultiPolygon", function(test) {

  var proj = d3.geoEquirectangular();

  proj.fitExtent([[50, 50], [950, 950]], {type: "MultiPolygon", coordinates: []});

  var s = proj.scale(),
      t = proj.translate();

  test.assert(!s);
  test.assert(isNaN(t[0]));
  test.assert(isNaN(t[1]));
  test.end();

});

tape("fitExtent: custom projection", function(test) {

  var projection = d3.geoProjection(function(x, y) {
    return [x, Math.pow(y, 3)];
  });

  projection.fitExtent([[50, 50], [950, 950]], world);

  test.inDelta(projection.scale(), 128.901140, 1e-6);
  test.inDelta(projection.translate(), [500, 450.406949], 1e-6);
  test.end();

});
