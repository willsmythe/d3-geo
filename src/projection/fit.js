import {default as geoStream} from "../stream";
import boundsStream from "../path/bounds";

function fit(project, extent, object) {

  var w = +extent[1][0] - +extent[0][0],
      h = +extent[1][1] - +extent[0][1],
      precision = project.precision(),
      clip = project.clipExtent && project.clipExtent();

  project
      .scale(1)
      .translate([0, 0]);

  if (clip !== undefined) {
    project.clipExtent(null);
  }

  geoStream(object, project.stream(boundsStream));

  var b = boundsStream.result(),
      s = 1 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
      x = +extent[0][0] + (w - s * (b[1][0] + b[0][0])) / 2,
      y = +extent[0][1] + (h - s * (b[1][1] + b[0][1])) / 2;

  if (clip !== undefined) {
    project.clipExtent(clip);
  }

  return project
      .scale(s)
      .translate([x, y])
      .precision(precision);
};

export function fitSize(project) {

  return function(size, object) {
    return fit(project,  [[0, 0], size], object);
  };

}

export function fitExtent(project) {

  return function(extent, object) {
    return fit(project, extent, object);
  };

}
