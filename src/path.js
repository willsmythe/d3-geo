import identity from "./identity";
import pathArea from "./path-area";
import pathBounds from "./path-bounds";
import PathString from "./path-string";
import pathCentroid from "./path-centroid";
import PathContext from "./path-context";
import stream from "./stream";

export default function() {
  var pointRadius = 4.5,
      projection,
      context,
      projectStream,
      contextStream,
      cacheStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
      stream(object, cacheStream);
    }
    return contextStream.result();
  }

  path.area = function(object) {
    stream(object, projectStream(pathArea));
    return pathArea.result();
  };

  path.bounds = function(object) {
    stream(object, projectStream(pathBounds));
    return pathBounds.result();
  };

  path.centroid = function(object) {
    stream(object, projectStream(pathCentroid));
    return pathCentroid.result();
  };

  // TODO test projection.sink instead of projection.stream?
  path.projection = function(_) {
    if (!arguments.length) return projection;
    projectStream = (projection = _) ? _.stream : identity;
    return reset();
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = (context = _) == null ? new PathString : new PathContext(_);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return reset();
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  function reset() {
    cacheStream = null;
    return path;
  }

  return path.projection(null).context(null); // TODO albersUsa
}
