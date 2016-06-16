import identity from "./identity";
import {degrees} from "./math";
import PathBuffer from "./path-buffer";
import PathContext from "./path-context";
import resample from "./resample";
import stream from "./stream";
import {transformRadians} from "./transform";

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

  // TODO path.area
  // TODO path.bounds
  // TODO path.centroid
  // TODO test projection.sink instead of projection.stream?

  path.projection = function(_) {
    if (!arguments.length) return projection;
    projectStream = (projection = _) ? _.stream || pathProjectStream(_) : identity;
    return reset();
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = (context = _) == null ? new PathBuffer : new PathContext(_);
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

function pathProjectStream(project) {
  var resampleProjectDegrees = resample(function(x, y) { return project([x * degrees, y * degrees]); });
  return function(stream) { return transformRadians(resampleProjectDegrees(stream)); };
}
