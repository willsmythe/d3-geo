var tape = require("tape"),
    topojson = require("topojson"),
    d3 = require("../../");

var usTopo = require("../data/us-10m.json"),
    us = topojson.feature(usTopo, usTopo.objects.land),
    worldTopo = require("../data/world-50m.json"),
    world = topojson.feature(worldTopo, worldTopo.objects.land);

// TODO: hemisphere, pole, clipExtent, custom projection

require("../inDelta");
tape("fit: world Equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 491.999512], 1e-6);
  test.end();

});

tape("fit: world AzimuthalEqualArea", function(test){

  var projection = d3.geoAzimuthalEqualArea();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 228.357167, 1e-6);
  test.inDelta(projection.translate(), [496.353437, 479.684335], 1e-6);
  test.end();

});

tape("fit: world AzimuthalEquidistant", function(test){

  var projection = d3.geoAzimuthalEquidistant();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 153.559157, 1e-6);
  test.inDelta(projection.translate(), [485.272655, 452.093361], 1e-6);
  test.end();

});

tape("fit: world ConicConformal", function(test){

  var projection = d3.geoConicConformal()
      .clipAngle(30)
      .parallels([30, 60])
      .rotate([0, -45]);

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 626.111017, 1e-6);
  test.inDelta(projection.translate(), [444.395872, 410.223792], 1e-6);
  test.end();

});

tape("fit: world ConicEqualArea", function(test){

  var projection = d3.geoConicEqualArea();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 145.862346, 1e-6);
  test.inDelta(projection.translate(), [500, 591.911769], 1e-6);
  test.end();

});

tape("fit: world ConicEquidistant", function(test){

  var projection = d3.geoConicEquidistant();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 123.085, 1e-6);
  test.inDelta(projection.translate(), [500, 528.541415], 1e-6);
  test.end();

});

tape("fit: world Equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 491.999512], 1e-6);
  test.end();

});

tape("fit: world Gnomonic", function(test){

  var projection = d3.geoGnomonic()
      .clipAngle(45);

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 450.348236, 1e-6);
  test.inDelta(projection.translate(), [500.115152, 556.52294], 1e-6);
  test.end();

});

tape("fit: world Mercator", function(test){

  var projection = d3.geoMercator();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [500, 481.549457], 1e-6);
  test.end();

});

tape("fit: world Orthographic", function(test){

  var projection = d3.geoOrthographic();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 451.428643, 1e-6);
  test.inDelta(projection.translate(), [503.769378, 498.61496], 1e-6);
  test.end();

});

tape("fit: world Stereographic", function(test){

  var projection = d3.geoStereographic();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 162.934518, 1e-6);
  test.inDelta(projection.translate(), [478.546849, 432.922426], 1e-6);
  test.end();

});

tape("fit: world TransverseMercator", function(test){

  var projection = d3.geoTransverseMercator();

  projection.fit(world, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 143.239449, 1e-6);
  test.inDelta(projection.translate(), [473.829753, 500], 1e-6);
  test.end();

});

tape("fit: USA AlbersUsa", function(test){

  var projection = d3.geoAlbersUsa();

  projection.fit(us, [[50, 50], [950, 950]]);

  test.inDelta(projection.scale(), 1152.889035, 1e-6);
  test.inDelta(projection.translate(), [533.52541, 496.232028], 1e-6);
  test.end();

});
