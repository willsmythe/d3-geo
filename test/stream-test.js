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
    test.isEqual(d3.geoStream({type: "Point", coordinates: [1, 2]}, {point: function() { return true; }}), undefined);
    test.end();
});

tape("stream allows empty multi-geometries", function(test) {
    d3.geoStream({type: "MultiPoint", coordinates: []}, {});
    d3.geoStream({type: "MultiLineString", coordinates: []}, {});
    d3.geoStream({type: "MultiPolygon", coordinates: []}, {});
    test.pass();
    test.end();
});

tape("Sphere ↦ sphere", function(test) {
    var calls = 0;
    d3.geoStream({type: "Sphere"}, {
    sphere: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls, 1);
    }
    });
    test.isEqual(calls, 1);
    test.end();
});

tape("Point ↦ point", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "Point", coordinates: [1, 2, 3]}, {
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(++calls, 1);
    }
    });
    test.isEqual(calls, 1);
    test.end();
});

tape("MultiPoint ↦ point*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "MultiPoint", coordinates: [[1, 2, 3], [4, 5, 6]]}, {
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(1 <= ++calls && calls <= 2, true);
    }
    });
    test.isEqual(calls, 2);
    test.end();
});

tape("LineString ↦ lineStart, point{2,}, lineEnd", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "LineString", coordinates: [[1, 2, 3], [4, 5, 6]]}, {
    lineStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls, 1);
    },
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(2 <= ++calls && calls <= 3, true);
    },
    lineEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls, 4);
    }
    });
    test.isEqual(calls, 4);
    test.end();
});

tape("MultiLineString ↦ (lineStart, point{2,}, lineEnd)*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "MultiLineString", coordinates: [[[1, 2, 3], [4, 5, 6]], [[7, 8, 9], [10, 11, 12]]]}, {
    lineStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 1 || calls === 5, true);
    },
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(2 <= ++calls && calls <= 3 || 6 <= calls && calls <= 7, true);
    },
    lineEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 4 || calls === 8, true);
    }
    });
    test.isEqual(calls, 8);
    test.end();
});

tape("Polygon ↦ polygonStart, lineStart, point{2,}, lineEnd, polygonEnd", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "Polygon", coordinates: [[[1, 2, 3], [4, 5, 6], [1, 2, 3]], [[7, 8, 9], [10, 11, 12], [7, 8, 9]]]}, {
    polygonStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 1, true);
    },
    lineStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 2 || calls === 6, true);
    },
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(3 <= ++calls && calls <= 4 || 7 <= calls && calls <= 8, true);
    },
    lineEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 5 || calls === 9, true);
    },
    polygonEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 10, true);
    }
    });
    test.isEqual(calls, 10);
    test.end();
});

tape("MultiPolygon ↦ (polygonStart, lineStart, point{2,}, lineEnd, polygonEnd)*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "MultiPolygon", coordinates: [[[[1, 2, 3], [4, 5, 6], [1, 2, 3]]], [[[7, 8, 9], [10, 11, 12], [7, 8, 9]]]]}, {
    polygonStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 1 || calls === 7, true);
    },
    lineStart: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 2 || calls === 8, true);
    },
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(3 <= ++calls && calls <= 4 || 9 <= calls && calls <= 10, true);
    },
    lineEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 5 || calls === 11, true);
    },
    polygonEnd: function() {
        test.isEqual(arguments.length, 0);
        test.isEqual(++calls === 6 || calls === 12, true);
    }
    });
    test.isEqual(calls, 12);
    test.end();
});

tape("Feature ↦ .*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "Feature", geometry: {type: "Point", coordinates: [1, 2, 3]}}, {
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(++calls, 1);
    }
    });
    test.isEqual(calls, 1);
    test.end();
});

tape("FeatureCollection ↦ .*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "FeatureCollection", features: [{type: "Feature", geometry: {type: "Point", coordinates: [1, 2, 3]}}]}, {
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(++calls, 1);
    }
    });
    test.isEqual(calls, 1);
    test.end();
});

tape("GeometryCollection ↦ .*", function(test) {
    var calls = 0, coordinates = 0;
    d3.geoStream({type: "GeometryCollection", geometries: [{type: "Point", coordinates: [1, 2, 3]}]}, {
    point: function(x, y, z) {
        test.isEqual(arguments.length, 3);
        test.isEqual(x, ++coordinates);
        test.isEqual(y, ++coordinates);
        test.isEqual(z, ++coordinates);
        test.isEqual(++calls, 1);
    }
    });
    test.isEqual(calls, 1);
    test.end();
});
