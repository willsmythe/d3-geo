module.exports = function(actual, expected, delta) {
  var lowerBound = expected - delta,
      upperBound = expected + delta;
  return typeof (actual) === 'number' && actual >= lowerBound && actual <= upperBound;
}
