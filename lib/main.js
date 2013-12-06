/*jslint indent: 2 */
/*jslint node: true */
/*jslint nomen: true*/
/*jslint white: true */

/*global window */

"use strict";

var d3_gauge_plus = (function() {
  var gauge = require('./gauge.js'),
    disk = require('./disk.js');
  return {
    Gauge: gauge.Gauge,
    disk: disk
  };
}());

if (window !== undefined) {
  window.d3_gauge_plus = d3_gauge_plus;
}
