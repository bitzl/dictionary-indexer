"use strict";

var PerformanceMeter = function() {
  this.start = new Date();
};

PerformanceMeter.prototype.round = function(total) {
  var duration = (new Date() - this.start) / 1000;
  var rate = total / duration;
  console.log("Indexed", total, "docs in", duration, "seconds. That's", rate, "docs/second.");
};

module.exports.PerformanceMeter = PerformanceMeter;
