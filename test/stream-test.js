var tape = require("tape"),
    d3 = require("../");
    
tape("stream does not allow null input", function(test) {
    try {
        d3.geoStream(null);
        test.fail("expected error");
    } catch (expected) {
        test.pass();
    }
    test.end();
});

tape("stream ignores unknown types", function(test) {
    d3.geoStream({type: "Unknown"}, {});
    d3.geoStream({type: "Feature", geometry: {type: "Unknown"}}, {});
    d3.geoStream({type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Unknown"}}]}, {});
    d3.geoStream({type: "GeometryCollection", geometries: [{type: "Unknown"}]}, {});
    test.pass();
    test.end();
});

tape("stream ignores null geometries", function(test) {
    d3.geoStream(null, {});
    d3.geoStream({type: "Feature", geometry: null}, {});
    d3.geoStream({type: "FeatureCollection", features: [{type: "Feature", geometry: null}]}, {});
    d3.geoStream({type: "GeometryCollection", geometries: [null]}, {});
    test.pass();
    test.end();
});

tape("stream returns void", function(test) {
    test.is(d3.geoStream({type: "Point", coordinates: [1, 2]}, {point: function() { return true; }}), undefined);
    test.end();
});

tape("stream allows empty multi-geometries", function(test) {
    d3.geoStream({type: "MultiPoint", coordinates: []}, {});
    d3.geoStream({type: "MultiLineString", coordinates: []}, {});
    d3.geoStream({type: "MultiPolygon", coordinates: []}, {});
    test.pass();
    test.end();
});
