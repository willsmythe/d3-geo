function streamGeometry(geometry, sink) {
  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
    streamGeometryType[geometry.type](geometry, sink);
  }
}

var streamObjectType = {
  Feature: function(feature, sink) {
    streamGeometry(feature.geometry, sink);
  },
  FeatureCollection: function(object, sink) {
    var features = object.features, i = -1, n = features.length;
    while (++i < n) streamGeometry(features[i].geometry, sink);
  }
};

var streamGeometryType = {
  Sphere: function(object, sink) {
    sink.sphere();
  },
  Point: function(object, sink) {
    object = object.coordinates;
    sink.point(object[0], object[1], object[2]);
  },
  MultiPoint: function(object, sink) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) object = coordinates[i], sink.point(object[0], object[1], object[2]);
  },
  LineString: function(object, sink) {
    streamLine(object.coordinates, sink, 0);
  },
  MultiLineString: function(object, sink) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamLine(coordinates[i], sink, 0);
  },
  Polygon: function(object, sink) {
    streamPolygon(object.coordinates, sink);
  },
  MultiPolygon: function(object, sink) {
    var coordinates = object.coordinates, i = -1, n = coordinates.length;
    while (++i < n) streamPolygon(coordinates[i], sink);
  },
  GeometryCollection: function(object, sink) {
    var geometries = object.geometries, i = -1, n = geometries.length;
    while (++i < n) streamGeometry(geometries[i], sink);
  }
};

function streamLine(coordinates, sink, closed) {
  var i = -1, n = coordinates.length - closed, coordinate;
  sink.lineStart();
  while (++i < n) coordinate = coordinates[i], sink.point(coordinate[0], coordinate[1], coordinate[2]);
  sink.lineEnd();
}

function streamPolygon(coordinates, sink) {
  var i = -1, n = coordinates.length;
  sink.polygonStart();
  while (++i < n) streamLine(coordinates[i], sink, 1);
  sink.polygonEnd();
}

export default function(object, sink) {
  if (object && streamObjectType.hasOwnProperty(object.type)) {
    streamObjectType[object.type](object, sink);
  } else {
    streamGeometry(object, sink);
  }
}
