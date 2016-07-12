var tape = require("tape"),
    topojson = require("topojson"),
    d3 = require("../../");

var us = require("../data/us-10m.json"),
    land = topojson.feature(us, us.objects.land);

require("../inDelta");

tape("fit: USA Equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 143.783157, 1e-6);
  test.inDelta(projection.translate(), [498.876615, 611.701678], 1e-6);
  test.end();

});

tape("fit: USA AzimuthalEqualArea", function(test){

  var projection = d3.geoAzimuthalEqualArea();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 542.032665, 1e-6);
  test.inDelta(projection.translate(), [854.206987, 1086.638566], 1e-6);
  test.end();

});

tape("fit: USA AzimuthalEquidistant", function(test){

  var projection = d3.geoAzimuthalEquidistant();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 404.464479, 1e-6);
  test.inDelta(projection.translate(), [861.570919, 1031.450355], 1e-6);
  test.end();

});

tape("fit: USA ConicConformal", function(test){

  var projection = d3.geoConicConformal();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 337.510571, 1e-6);
  test.inDelta(projection.translate(), [581.872074, 930.761754], 1e-6);
  test.end();

});

tape("fit: USA ConicEqualArea", function(test){

  var projection = d3.geoConicEqualArea();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 291.198886, 1e-6);
  test.inDelta(projection.translate(), [576.510061, 877.777053], 1e-6);
  test.end();

});

tape("fit: USA ConicEquidistant", function(test){

  var projection = d3.geoConicEquidistant();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 311.156071, 1e-6);
  test.inDelta(projection.translate(), [578.496843, 899.864338], 1e-6);
  test.end();

});

tape("fit: USA Equirectangular", function(test){

  var projection = d3.geoEquirectangular();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 143.783157, 1e-6);
  test.inDelta(projection.translate(), [498.876615, 611.701678], 1e-6);
  test.end();

});

tape("fit: USA Gnomonic", function(test){

  var projection = d3.geoGnomonic().clipAngle(90);

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 0, 1e-6);
  test.inDelta(projection.translate(), [904.503764, 950], 1e-6);
  test.end();

});

tape("fit: USA Mercator", function(test){

  var projection = d3.geoMercator();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 143.783157, 1e-6);
  test.inDelta(projection.translate(), [498.876615, 652.399043], 1e-6);
  test.end();

});

tape("fit: USA Orthographic", function(test){

  var projection = d3.geoOrthographic();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 2037.833598, 1e-6);
  test.inDelta(projection.translate(), [2052.48573, 1568.919598], 1e-6);
  test.end();

});

tape("fit: USA Stereographic", function(test){

  var projection = d3.geoStereographic();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 483.390791, 1e-6);
  test.inDelta(projection.translate(), [751.728762, 1054.50814], 1e-6);
  test.end();

});

tape("fit: USA TransverseMercator", function(test){

  var projection = d3.geoTransverseMercator();

  projection.fit(land, [[50, 50],[950, 950]]);

  test.inDelta(projection.scale(), 420.414716, 1e-6);
  test.inDelta(projection.translate(), [786.851375, 1219.474867], 1e-6);
  test.end();

});
