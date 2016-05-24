# d3-geo

…

## Installing

If you use NPM, `npm install d3-geo`. Otherwise, download the [latest release](https://github.com/d3/d3-geo/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-geo.v0.0.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3_geo` global is exported:

```html
<script src="https://d3js.org/d3-geo.v0.0.min.js"></script>
<script>

var stream = d3_geo.geoStream();

</script>
```

[Try d3-geo in your browser.](https://tonicdev.com/npm/d3-geo)

## API Reference

<a href="#geoStream" name="geoStream">#</a> d3.<b>geoStream</b>(<i>object</i>, <i>listener</i>)

Streams the specified [GeoJSON](http://geojson.org) *object* to the specified stream *listener*. (Despite the name “stream”, these method calls are currently synchronous.) While both features and geometry objects are supported as input, the stream interface only describes the geometry, and thus additional feature properties are not visible to listeners.

## Stream Listeners

Stream listeners must implement several methods to traverse geometry. Listeners are inherently stateful; the meaning of a [point](#point) depends on whether the point is inside of a [line](#lineStart), and likewise a line is distinguished from a ring by a [polygon](#polygonStart).

<a name="stream_point" href="#stream_point">#</a> listener.<b>point</b>(<i>x</i>, <i>y</i>[, <i>z</i>])

Indicates a point with the specified coordinates *x* and *y* (and optionally *z*). The coordinate system is unspecified and implementation-dependent; for example, [projection streams](Geo-Projections#stream) require spherical coordinates in degrees as input. Outside the context of a polygon or line, a point indicates a point geometry object ([Point](http://www.geojson.org/geojson-spec.html#point) or [MultiPoint](http://www.geojson.org/geojson-spec.html#multipoint)). Within a line or polygon ring, the point indicates a control point.

<a name="stream_lineStart" href="#stream_lineStart">#</a> listener.<b>lineStart</b>()

Indicates the start of a line or ring. Within a polygon, indicates the start of a ring. The first ring of a polygon is the exterior ring, and is typically clockwise. Any subsequent rings indicate holes in the polygon, and are typically counterclockwise.

<a name="stream_lineEnd" href="#stream_lineEnd">#</a> listener.<b>lineEnd</b>()

Indicates the end of a line or ring. Within a polygon, indicates the end of a ring. Unlike GeoJSON, the redundant closing coordinate of a ring is *not* indicated via [point](#point), and instead is implied via lineEnd within a polygon. Thus, the given polygon input:

```json
{
  "type": "Polygon",
  "coordinates": [
    [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]
  ]
}
```

Will produce the following series of method calls on the listener:

```js
listener.polygonStart();
listener.lineStart();
listener.point(0, 0);
listener.point(1, 0);
listener.point(1, 1);
listener.point(0, 1);
listener.lineEnd();
listener.polygonEnd();
```

<a name="stream_polygonStart" href="#stream_polygonStart">#</a> listener.<b>polygonStart</b>()

Indicates the start of a polygon. The first line of a polygon indicates the exterior ring, and any subsequent lines indicate interior holes.

<a name="stream_polygonEnd" href="#stream_polygonEnd">#</a> listener.<b>polygonEnd</b>()

Indicates the end of a polygon.

<a name="stream_sphere" href="#stream_sphere">#</a> listener.<b>sphere</b>()

Indicates the sphere (the globe; the unit sphere centered at ⟨0,0,0⟩).

## Spherical Math

<a name="geoLength" href="#geoLength">#</a> d3.<b>geoLength</b>(<i>feature</i>)

Returns the great-arc length of the specified *feature* in [radians](http://mathworld.wolfram.com/Radian.html). For polygons, returns the perimeter of the exterior ring plus that of any interior rings.
