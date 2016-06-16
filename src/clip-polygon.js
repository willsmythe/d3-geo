import {sphericalEqual} from "./spherical";

// General spherical polygon clipping algorithm: takes a polygon, cuts it into
// visible line segments and rejoins the segments by interpolating along the
// clip edge.
export default function(segments, compare, clipStartInside, interpolate, sink) {
  var subject = [],
      clip = [],
      i,
      n;

  segments.forEach(function(segment) {
    if ((n = segment.length - 1) <= 0) return;
    var n, p0 = segment[0], p1 = segment[n];

    // If the first and last points of a segment are coincident, then treat as
    // a closed ring.
    // TODO if all rings are closed, then the winding order of the exterior
    // ring should be checked.
    if (sphericalEqual(p0, p1)) {
      sink.lineStart();
      for (i = 0; i < n; ++i) sink.point((p0 = segment[i])[0], p0[1]);
      sink.lineEnd();
      return;
    }

    var a = new Intersection(p0, segment, null, true),
        b = new Intersection(p0, null, a, false);
    a.o = b;
    subject.push(a);
    clip.push(b);
    a = new Intersection(p1, segment, null, false);
    b = new Intersection(p1, null, a, true);
    a.o = b;
    subject.push(a);
    clip.push(b);
  });

  if (!subject.length) return;

  clip.sort(compare);
  link(subject);
  link(clip);

  for (i = 0, n = clip.length; i < n; ++i) {
    clip[i].e = clipStartInside = !clipStartInside;
  }

  var start = subject[0],
      points,
      point;

  while (1) {
    // Find first unvisited intersection.
    var current = start,
        isSubject = true;
    while (current.v) if ((current = current.n) === start) return;
    points = current.z;
    sink.lineStart();
    do {
      current.v = current.o.v = true;
      if (current.e) {
        if (isSubject) {
          for (i = 0, n = points.length; i < n; ++i) sink.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.n.x, 1, sink);
        }
        current = current.n;
      } else {
        if (isSubject) {
          points = current.p.z;
          for (i = points.length - 1; i >= 0; --i) sink.point((point = points[i])[0], point[1]);
        } else {
          interpolate(current.x, current.p.x, -1, sink);
        }
        current = current.p;
      }
      current = current.o;
      points = current.z;
      isSubject = !isSubject;
    } while (!current.v);
    sink.lineEnd();
  }
}

function link(array) {
  if (!(n = array.length)) return;
  var n,
      i = 0,
      a = array[0],
      b;
  while (++i < n) {
    a.n = b = array[i];
    b.p = a;
    a = b;
  }
  a.n = b = array[0];
  b.p = a;
}

function Intersection(point, points, other, entry) {
  this.x = point;
  this.z = points;
  this.o = other; // another intersection
  this.e = entry; // is an entry?
  this.v = false; // visited
  this.n = this.p = null; // next & previous
}
