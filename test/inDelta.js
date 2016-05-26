var tape = require("tape");

tape.Test.prototype.inDelta = function(actual, expected, delta) {
  delta = delta || 1e-6;
  this._assert(expected - delta < actual && actual < expected + delta, {
    message: "should be in delta " + delta,
    operator: "inDelta",
    actual: actual,
    expected: expected
  });
};
