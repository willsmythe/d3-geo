import {default as geoStream} from "../stream";
import boundsStream from "../path/bounds";

export function fitExtent(projection, extent, object) {
  var w = extent[1][0] - extent[0][0],
      h = extent[1][1] - extent[0][1],
      clip = projection.clipExtent && projection.clipExtent();

  projection
      .scale(150)
      .translate([0, 0]);

  if (clip != null) projection.clipExtent(null);

  geoStream(object, projection.stream(boundsStream));

  var b = boundsStream.result(),
      k = Math.min(w / (b[1][0] - b[0][0]), h / (b[1][1] - b[0][1])),
      ew = w !== Infinity ? w : (b[1][0] - b[0][0]) * k,
      eh = h !== Infinity ? h : (b[1][1] - b[0][1]) * k,
      x = +extent[0][0] + (ew - k * (b[1][0] + b[0][0])) / 2,
      y = +extent[0][1] + (eh - k * (b[1][1] + b[0][1])) / 2;

  if (clip != null) projection.clipExtent(clip);

  return projection
      .scale(k * 150)
      .translate([x, y]);
}

export function fitSize(projection, size, object) {
  return fitExtent(projection, [[0, 0], size], object);
}

export function fitWidth(projection, width, object) {
  return fitExtent(projection, [[0, 0], [width, Infinity]], object);
}

export function fitHeight(projection, height, object) {
  return fitExtent(projection, [[0, 0], [Infinity, height]], object);
}
