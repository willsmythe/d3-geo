import {asin} from "../math";
import azimuthal from "./azimuthal";
import projection from "./index";

export var orthographic = azimuthal(function() { return 1; }, asin);

export default function() {
  return projection(orthographic);
}
