import {default as geoStream} from "../stream";
import boundsStream from "../path/bounds";

export function fit(project) {

  return function(object, extent) {

    var w = extent[1][0] - extent[0][0],
        h = extent[1][1] - extent[0][1];

    project.scale(1)
        .translate([0, 0]);

    geoStream(object, project.stream(boundsStream));
    var b = boundsStream.result();
    var s = 1 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
        x = extent[0][0] + (w - s * (b[1][0] + b[0][0])) / 2;
        y = extent[0][1] + (h - s * (b[1][1] + b[0][1])) / 2;

    return project.scale(s)
        .translate([x, y]);
  };

}
