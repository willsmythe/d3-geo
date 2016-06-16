import projection from "./projection";

export function equirectangular(lambda, phi) {
  return [lambda, phi];
}

equirectangular.invert = equirectangular;

export default function() {
  return projection(equirectangular);
}
