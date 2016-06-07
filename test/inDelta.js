var tape = require("tape");

tape.Test.prototype.inDelta = function(actual, expected, delta) {
  delta = delta || 1e-6;
  this.assert(inDelta(actual, expected, delta), "expected " + actual + " to be in within *" + delta + "* of " + expected);
};

function inDelta(actual, expected, delta) {
  return (Array.isArray(expected) ? inDeltaArray : inDeltaNumber)(actual, expected, delta);
}

function inDeltaArray(actual, expected, delta) {
  var n = expected.length, i = -1;
  if (actual.length !== n) return false;
  while (++i < n) if (!inDelta(actual[i], expected[i], delta)) return false;
  return true;
}

function inDeltaNumber(actual, expected, delta) {
  return actual >= expected - delta && actual <= expected + delta;
}