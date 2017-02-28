import {default as polygonContains} from "./polygonContains";
import {default as distance} from "./distance";
import {epsilon,radians} from "./math";

var contains = {
  Sphere: function() {
    return true;
  },
  Point: function(feature, point) {
    return distance(feature.coordinates, point) === 0;
  },
  MultiPoint: function(feature, point) {
    var coordinates = feature.coordinates, i = -1, n = coordinates.length, f;
    while (++i < n) {
      f = { type: "Point", coordinates: coordinates[i] };
      if (contains[f.type](f, point)) {
        return true;
      }
    }
    return false;
  },
  LineString: function(feature, point) {
    var ab = distance(feature.coordinates[0], feature.coordinates[1]),
      ao = distance(feature.coordinates[0], point),
      ob = distance(point, feature.coordinates[1]);
    return ao + ob <= ab + epsilon;
  },
  MultiLineString: function(feature, point) {
    var coordinates = feature.coordinates, i = -1, n = coordinates.length, f;
    while (++i < n) {
      f = { type: "LineString", coordinates: coordinates[i] };
      if (contains[f.type](f, point)) {
        return true;
      }
    }
    return false;
  },
  Polygon: function(feature, point) {
    return !!polygonContains(feature.coordinates.map(ringRadians), pointRadians(point));
  },
  MultiPolygon: function(feature, point) {
    var coordinates = feature.coordinates, i = -1, n = coordinates.length, f;
    point = pointRadians(point);
    while (++i < n) {
      f = coordinates[i].map(ringRadians);
      if (polygonContains(f, point)) {
        return true;
      }
    }
    return false;
  },
  GeometryCollection: function(feature, point) {
    var geometries = feature.geometries, i = -1, n = geometries.length;
    while (++i < n) {
      var f = geometries[i];
      if (contains[f.type](f, point)) {
        return true;
      }
    }
    return false;
  },
  Feature: function(feature, point) {
    var geometry = feature.geometry;
    return contains[geometry.type](geometry, point);
  },
  FeatureCollection: function(feature, point) {
    var features = feature.features, i = -1, n = features.length;
    while (++i < n) {
      var f = features[i];
      if (contains[f.type](f, point)) {
        return true;
      }
    }
    return false;
  }
};

function ringRadians(ring) {
  return ring = ring.map(pointRadians), ring.pop(), ring;
}

function pointRadians(point) {
  return [point[0] * radians, point[1] * radians];
}

export default function(feature, point) {
  return (feature.type in contains)
    ? contains[feature.type](feature, point)
    : false;
}
