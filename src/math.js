export var epsilon = 1e-6;
export var pi = Math.PI;
export var halfPi = pi / 2;
export var tau = pi * 2;

export var degrees = 180 / pi;
export var radians = pi / 180;

export var abs = Math.abs;
export var atan2 = Math.atan2;
export var cos = Math.cos;
export var ceil = Math.ceil;
export var floor = Math.floor;
export var sin = Math.sin;
export var sqrt = Math.sqrt;

export function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi : Math.asin(x);
}
export function asin(x) {
  return x > 1 ? halfPi : x < -1 ? -halfPi : Math.asin(x);
}

export function haversin(x) {
  return (x = sin(x / 2)) * x;
}

// Adds floating point numbers with twice the normal precision.
// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
// 305–363 (1997).
// Code adapted from GeographicLib by Charles F. F. Karney,
// http://geographiclib.sourceforge.net/
// See lib/geographiclib/LICENSE for details.

export function adder() {}

adder.prototype = {
  s: 0, // rounded value
  t: 0, // exact error
  add: function(y) {
    adderSum(y, this.t, adderTemp);
    adderSum(adderTemp.s, this.s, this);
    if (this.s) this.t += adderTemp.t;
    else this.s = adderTemp.t;
  },
  reset: function() {
    this.s = this.t = 0;
  },
  valueOf: function() {
    return this.s;
  }
};

var adderTemp = new adder;

function adderSum(a, b, o) {
  var x = o.s = a + b, // a + b
      bv = x - a, av = x - bv; // b_virtual & a_virtual
  o.t = (a - av) + (b - bv); // a_roundoff + b_roundoff
}
