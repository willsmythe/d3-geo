import identity from "../identity";
import stream from "../stream";
import pathArea from "./area";
import pathBounds from "./bounds";
import pathCentroid from "./centroid";
import PathContext from "./context";
import PathString from "./string";

export default function() {
  var pointRadius = 4.5,
      projection,
      context,
      projectStream,
      contextStream;

  function path(object) {
    if (object) {
      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
      stream(object, projectStream(contextStream));
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

  path.projection = function(_) {
    if (!arguments.length) return projection;
    projectStream = (projection = _) ? _.stream : identity;
    return path;
  };

  path.context = function(_) {
    if (!arguments.length) return context;
    contextStream = (context = _) == null ? new PathString : new PathContext(_);
    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
    return path;
  };

  path.pointRadius = function(_) {
    if (!arguments.length) return pointRadius;
    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
    return path;
  };

  return path.projection(null).context(null); // TODO albersUsa
}
