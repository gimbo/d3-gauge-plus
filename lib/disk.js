/*jslint indent: 2 */
/*jslint node: true */
/*jslint nomen: true*/
/*jslint white: true */

/*global d3 */

// A context for drawing into SVG using polar co-ordinates.

"use strict";

var _ = require("./lodash-2.4.0.min.js");

var diskProto = {

  name: "defaultDisk",
  radius: 100,
  classes: "disk",

  defaultStyles: {
    "fill": "#000",
    "stroke": "#000",
    "stroke-width": "1px",
    "font-family": "sans-serif"
  },

  degreesToRadians: function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  },

  /**
   * @private
   * Convert from polar to cartesian co-ordinates.
   * @param {Number} t Angle in degrees, where 0 degrees is
   *     upwards.
   * @param {Number} r Distance from disk's centre, as a
   *     proportion of the disk's radius (i.e. a number between 0
   *     and 1).
   */
  polarToCartesian: function polarToCartesian(t, r) {
    // We add 90 degrees to t here so that t=0 degrees means "upwards"
    // (otherwise it means "to the left", which is just weird).
    var radians = this.degreesToRadians(t + 90);
    return {
      x: this.radius - this.radius * r * Math.cos(radians), // XXX
      y: this.radius - this.radius * r * Math.sin(radians)  // XXX
    };
  },

  /**
   * Set some styles on some object.  Given a target object and a
   * list of style names to set, it sets each of those styles on
   * the object to either the disk object's default styles or (if
   * specified here) an override value.
   * @private
   * @param {Object} target The object whose styles we wish to
   *     modify.
   * @param {String[]} styles Names of styles to set.  An array
   *     containing zero or more of the strings "fill", "stroke"
   *     and "stroke-width".
   * @param {Object} [overrides] An object containing overrides of
   *     the disk's default drawing styles.
   * @param {String} [overrides.fill] A fill colour, e.g. "#000".
   * @param {String} [overrides.stroke] A stroke colour,
   *     e.g. "#000".
   * @param {String} [overrides.stroke-width] A stroke width,
   *     e.g. "1px".
   * @param {String} [overrides.font-family] A font family,
   *     e.g. "Courier New".
   */
  setStyles: function setStyles(target, styles, overrides) {
    var useStyles = _.merge({}, this.defaultStyles, overrides);
    styles.forEach(function(style) {
      if (useStyles[style] !== undefined) {
        target.style(style, useStyles[style]);
      }
    });
  },

  /**
   * Draw a circle.
   * @param {Number} radius Radius of circle, as a proportion of the disk's
   *     radius (i.e. a number between 0 and 1).
   * @param {Object} [styles] Overrides of the disk's default
   *     styles for drawing.
   * @param {String} [styles.fill] The circle's fill colour,
   *     e.g. "#000".
   * @param {String} [styles.stroke] The circle's stroke colour
   *     (for its outline), e.g. "#000".
   * @param {String} [styles.stroke-width] The circle's stroke
   *     width (for its outline) e.g. "1px".
   */
  drawCircle: function drawCircle(radius, styles) {
    var circle = this.body.append("svg:circle")
        .attr("cx", this.radius)
        .attr("cy", this.radius)
        .attr("r", this.radius * radius);
    this.setStyles(circle, ["fill", "stroke", "stroke-width"], styles);
    return this;
  },

  /**
   * Draw a radial line.
   * @param {Number} angle Angle at which to draw radial, in
   *     degrees.
   * @param {Number} innerRadius Inner limit of radial, as a
   *     proportion of the disk's radius (i.e. a number between 0
   *     and 1).
   * @param {Number} outerRadius Outer limit of radial, as a
   *     proportion of the disk's radius (i.e. a number between 0
   *     and 1).
   * @param {Object} [styles] Overrides of the disk's default styles for
   *     drawing.
   * @param {String} [styles.stroke] The radial's stroke colour,
   *     e.g. "#000".
   * @param {String} [styles.stroke-width] The radial's stroke width,
   *     e.g. "1px".
   */
  drawRadial: function drawRadial(angle, innerRadius, outerRadius, styles) {
    var start = this.polarToCartesian(angle, innerRadius),
      end = this.polarToCartesian(angle, outerRadius),
      radial = this.body.append("svg:line")
          .attr("x1", start.x)
          .attr("y1", start.y)
          .attr("x2", end.x)
          .attr("y2", end.y);
    this.setStyles(radial, ["stroke", "stroke-width"], styles);
    return this;
  },

  /**
   * Draw an arc.
   * @param {Number} startAngle Start angle of arc, in degrees.
   * @param {Number} endAngle End angle of arc, in degrees.
   * @param {Number} innerRadius Inner radius of arc, as a
   *     proportion of the disk's radius (i.e. a number between 0
   *     and 1).
   * @param {Number} outerRadius Outer radius of arc, as a
   *     proportion of the disk's radius (i.e. a number between 0
   *     and 1).
   * @param {Object} [styles] Overrides of the disk's default styles for
   *     drawing.
   * @param {String} [styles.fill] The arc's colour, e.g. "#000".
   * @param {String} [styles.stroke] The arc's stroke colour,
   *     e.g. "#000".
   * @param {String} [styles.stroke-width] The arc's stroke width,
   *     e.g. "1px".
   */
  drawArc: function drawArc(startAngle, endAngle, innerRadius,
    outerRadius, styles) {
    var self = this,
      arc = this.body.append("svg:path");
    this.setStyles(arc, ["fill", "stroke", "stroke-width"], styles);
    arc.attr("d", d3.svg.arc()
          .startAngle(this.degreesToRadians(startAngle))
          .endAngle(this.degreesToRadians(endAngle))
          .innerRadius(innerRadius * this.radius)
          .outerRadius(outerRadius * this.radius))
      .attr("transform", function() {
        return "translate(" + self.radius + ", " + self.radius + ")";
      });
    return this;
  },

  /**
   * Draw some text.
   * @param {Number} angle Angular component of polar co-ordinate
   *     at which to draw text.
   * @param {Number} radius Radial component of polar co-ordinate
   *     at which to draw text; a proportion of the disk's radius
   *     (i.e. a number between 0 and 1).
   * @param {Number} rotation Angle by which to rotate text (0 is
   *     no rotation).
   * @param {Number} fontSize Font size, as a proportion of the
   *     disk's radius (i.e. a number between 0 and 1).
   * @param {String} text The text to draw.
   * @param {Object} [styles] Overrides of the disk's default
   *     styles for drawing.
   * @param {String} [styles.fill] The text's fill colour,
   *     e.g. "#000".
   * @param {String} [styles.font-family] The text's font family,
   *     e.g. "Courier New".
   */
  drawText: function drawText(angle, radius, rotation, fontSize, text,
    styles) {
    var loc = this.polarToCartesian(angle, radius),
      size = Math.floor(this.radius * fontSize),
      // dy = Math.floor((this.radius * fontSize) / 2);
    // loc.y = loc.y - dy;
      tsvg = this.body.append("svg:text")
          .attr("x", loc.x)
          .attr("y", loc.y) // this.config.cy / 2 + fontSize / 2)
          .attr("dy", 0) // dy) // fontSize / 2)
          .attr("text-anchor", "middle")
          .style("dominant-baseline", "central")
          .text(text)
          .style("font-size", size + "px");
    this.setStyles(tsvg, ["fill", "font-family"], styles);
    tsvg.attr("transform", function() {
      return "rotate(" + rotation + "," + loc.x + "," + loc.y + ")";
    });
    return this;
  }

};

exports.createDisk = function(config) {
  var newDisk = _.merge({}, diskProto, config);
  // console.log("CreateDisk", config, newDisk);
  newDisk.body = d3.select("#" + newDisk.name)
    .append("svg:svg")
    .attr("class", newDisk.classes)
    .attr("width", newDisk.radius * 2)
    .attr("height", newDisk.radius * 2);
  return newDisk;
};
