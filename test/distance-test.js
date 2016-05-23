var tape = require("tape"),
    d3 = require("../");
    
require('./inDelta');

tape("geoDistance computes the great-arc distance", function(test) {
  test.equal(d3.geoDistance([0, 0], [0, 0]), 0);
  test.inDelta(d3.geoDistance([118 + 24 / 60, 33 + 57 / 60], [73 + 47 / 60, 40 + 38 / 60]), 3973 / 6371, 0.5);
  test.end();
});

tape("geoDistance computes small distances", function(test) {
  test.assert(d3.geoDistance([0, 0], [0, 1e-12]) > 0);
  test.end();
});
