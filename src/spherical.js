export function spherical(cartesian) {
  return [
    Math.atan2(cartesian[1], cartesian[0]),
    Math.asin(cartesian[2])
  ];
}

export function sphericalEqual(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;
}
