/*jslint indent: 2 */
/*jslint node: true */
/*jslint nomen: true*/
/*jslint white: true */

/*global d3 */

"use strict";

// A context for drawing into SVG using polar co-ordinates.
var disk = require('./disk.js');

function Gauge(gaugeName, configuration) {

  this.gaugeName = gaugeName;

  var self = this; // for internal d3 functions

  this.configure = function(configuration) {

    var defaults,
      key;
    this.config = configuration;

    function setConfig(name, defaultValue) {
      if (self.config[name] === undefined) {
        self.config[name] = defaultValue;
      }
    }

    function clamp(name, minimum, maximum) {
      if (undefined !== minimum) {
        self.config[name] = Math.max(self.config[name], minimum);
      }
      if (undefined !== maximum) {
        self.config[name] = Math.min(self.config[name], maximum);
      }
    }

    defaults = {

      size: 100,
      // Offset gap degrees (anticlockwise).  0: gap at bottom; 90:
      // gap at right.
      rotation: 90,
      gap: 90,

      drawOuterCircle: true,
      outerStrokeColor: "#000",
      outerFillColor: "#ccc",
      innerStrokeColor: "#e0e0e0",
      innerFillColor: "#fff",

      label: undefined,
      labelSize: 0.1, // Default font size is 10% of radius.
      labelColor: "#333",

      min: -6,
      max: 6,
      initial: undefined,
      clampUnderflow: false,
      clampOverflow: false,

      majorTickColor: "#333",
      majorTickWidth: "2px",
      minorTicks: 5,
      minorTickColor: "#666",
      minorTickWidth: "1px",

      greenColor: "#109618",
      yellowColor: "#FF9900",
      redColor: "#DC3912",

      transitionDuration: 500

    };

    for (key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        setConfig(key, defaults[key]);
      }
    }

    // Object.keys(defaults).forEach(function (key) {
    //   setConfig(key, defaults[key]);
    // });

    this.config.size = this.config.size * 0.9;
    this.config.radius = this.config.size * 0.97 / 2;
    this.config.cx = this.config.size / 2;
    this.config.cy = this.config.size / 2;
    this.config.range = this.config.max - this.config.min;
    setConfig("initial", (this.config.min + this.config.max) / 2);
    setConfig("majorTicks", this.config.range + 1);

    clamp("majorTicks", 0);
    clamp("minorTicks", 0);
    clamp("transitionDuration", 0);
    clamp("gap", 0, 360);

    // console.log(this.config);
  };

  this.render = function() {
    this.disk = disk.createDisk({
        name: this.gaugeName,
        classes: "gauge",
        radius: this.config.size / 2
      });

    this.renderDisk();
    this.renderLabel();
    this.renderRegions([
      [this.config.greenZones, this.config.greenColor],
      [this.config.yellowZones, this.config.yellowColor],
      [this.config.redZones, this.config.redColor]
    ]);
    this.renderTicks();
    this.renderPointer();
    this.setPointer(this.config.initial, 0);
  };

  this.renderDisk = function() {
    // Outer circle
    if (this.config.drawOuterCircle) {
      this.disk.drawCircle(1, {
        fill: this.config.outerFillColor,
        stroke: this.config.outerStrokeColor,
        "stroke-width": "0.5px"
      });
    }

    // Inner circle
    this.disk.drawCircle(0.9, {
      fill: this.config.innerFillColor,
      stroke: this.config.innerStrokeColor,
      "stroke-width": "0.5px"
    });
  };

  this.renderLabel = function() {
    if (undefined !== this.config.label) {
      this.disk.drawText(0, 0.3, 0, this.config.labelSize, this.config.label, {
        fill: this.config.labelColor
      });
    }
  };

  this.renderRegions = function(zones) {
    function renderOneRegion(region, color) {
      region.forEach(function(band) {
        self.drawBand(band.from, band.to, color);
      });
    }
    this.clearRegions();
    zones.forEach(function(zone) {
      renderOneRegion(zone[0], zone[1]);
    });
    renderOneRegion(this.config.yellowZones, this.config.yellowColor);
    renderOneRegion(this.config.redZones, this.config.redColor);
  };

  this.clearRegions = function() {
    this.disk.body.selectAll(".gaugeBand").remove();
  };

  this.drawBand = function(start, end, color) {
    var startDegrees = this.valueToDegrees(start),
      endDegrees = this.valueToDegrees(end);
    this.disk.drawArc(startDegrees, endDegrees, 0.65, 0.85, {
      fill: color,
      stroke: "none"
    });
  };

  this.renderTicks = function() {
    var majorDelta,
      minorDelta,
      major,
      minor,
      majorDegrees,
      majorText,
      fontSize = 0.1; // XXX
    // Render major ticks.
    if (this.config.majorTicks <= 0) {
      return;
    }
    majorDelta = this.config.range / (this.config.majorTicks - 1);
    for (major = this.config.min; major <= this.config.max; major += majorDelta) {
      // Render minor ticks.
      minorDelta = majorDelta / this.config.minorTicks;
      for (minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
        this.disk.drawRadial(this.valueToDegrees(minor), 0.75, 0.85, {
          stroke: this.config.minorTickColor,
          "stroke-width": this.config.minorTickWidth
        });
      }
      majorDegrees = this.valueToDegrees(major);
      this.disk.drawRadial(majorDegrees, 0.7, 0.85, {
        stroke: this.config.majorTickColor,
        "stroke-width": this.config.majorTickWidth
      });

      // Render numbers.
      majorText = parseFloat(major.toFixed(2));
      this.disk.drawText(majorDegrees, 0.58, 0, fontSize, majorText, {
        fill: this.config.majorTickColor
      });
    }
  };

  this.renderPointer = function() {
    var pointerContainer,
      pointerPath,
      pointerLine,
      fontSize;
    pointerContainer = this.disk.body.append("svg:g").attr("class", "pointerContainer");
    this.pointerValue = this.config.min; // Start out pointing at minimum value.
    pointerPath = this.buildPointerPath();
    pointerLine = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .interpolate("basis");
    pointerContainer.selectAll("path")
        .data([pointerPath])
      .enter().append("svg:path")
        .attr("d", pointerLine)
        .style("fill", "#dc3912")
        .style("stroke", "#c63310")
        .style("fill-opacity", 0.7);
    fontSize = Math.round(this.config.labelSize * this.config.size / 2);
    pointerContainer.selectAll("text")
        .data([this.pointerValue])
      .enter().append("svg:text")
        .attr("x", this.config.cx)
        .attr("y", this.config.size - this.config.cy / 2 - fontSize)
        .attr("dy", fontSize / 2)
        .attr("text-anchor", "middle")
        .style("font-size", fontSize + "px")
        .style("fill", this.config.labelColor)
        .style("stroke-width", "0px");
  };

  // Compute points for initial pointer state.
  this.buildPointerPath = function() {
    var fatness = 15,
      head,
      head1,
      head2,
      tailAngle,
      tail,
      tail1,
      tail2;
    this.pointerAngle = this.valueToDegrees(this.pointerValue);
    tailAngle = this.pointerAngle + 180;
    head = this.polarToCartesian(this.pointerAngle, 0.65);
    head1 = this.polarToCartesian(this.pointerAngle - fatness, 0.12);
    head2 = this.polarToCartesian(this.pointerAngle + fatness, 0.12);
    tail = this.polarToCartesian(tailAngle, 0.28);
    tail1 = this.polarToCartesian(tailAngle - fatness, 0.12);
    tail2 = this.polarToCartesian(tailAngle + fatness, 0.12);
    return [head, head1, tail2, tail, tail1, head2, head];
  };

  this.setPointer = function(newValue, duration) {
    var valueForAngle,
      oldAngle = this.pointerAngle,
      newAngle,
      pointerContainer = this.disk.body.select(".pointerContainer");
    if ((newValue > self.config.max) && this.config.clampOverflow) {
      newValue = self.config.max;
    } else if ((newValue < self.config.min) && this.config.clampUnderflow) {
      newValue = self.config.min;
    }
    if (newValue > self.config.max) {
      valueForAngle = self.config.max + 0.02 * self.config.range;
    } else if (newValue < self.config.min) {
      valueForAngle = self.config.min - 0.02 * self.config.range;
    } else {
      valueForAngle = newValue;
    }
    if (undefined === duration) {
      duration = this.config.transitionDuration;
    }
    newAngle = self.valueToDegrees(valueForAngle) + this.config.rotation - (this.config.gap / 2);
    this.pointerAngle = newAngle;
    this.pointerValue = newValue;
    this.rotateElement(pointerContainer.selectAll("path"),
                       oldAngle,
                       newAngle,
                       self.config.cx,
                       self.config.cy,
                       duration);
    pointerContainer.selectAll("text").text(parseFloat(newValue.toFixed(2)));
  };



  // Converting gauge values to angles and points on the disk.

  // Convert a value (on the guage) into the corresponding angle on
  // the gauge.
  this.valueToDegrees = function(value) {
    var valueProp,
      rotate,
      arc,
      angleFromStart;
    // Value as a proportion of the range.  Somewhere between 0 and 1
    // (or slightly out of that ranfge for underflow/overflow).
    valueProp = (value - this.config.min) / this.config.range;
    // 0 rotation (in config) means gap at bottom.  But in drawing
    // terms, 0 degrees is upwards (assuming the computation goes via
    // polarToCartesian below, which it should), so we rotate
    // everything by 180 degrees to get 0 degrees to point to the
    // bottom, then rotate by half of whatever gap has been requested
    // in order to centre the gap there.  Finally add whatever
    // rotation the config asks for.
    rotate = 180 + (this.config.gap / 2) + this.config.rotation;
    // arc is the number of degrees covered by the gauge - it defaults
    // to 270 (ie a gap of 90 degrees).
    arc = 360 - this.config.gap;
    angleFromStart = valueProp * arc + rotate;
    return angleFromStart;
  };

  this.valueToRadians = function(value) {
    return this.degreesToRadians(this.valueToDegrees(value));
  };

  // Convert a gauge value and a factor (0-1, a proportion of the
  // radius) to cartesian co-ordinates.
  this.valueToPoint = function(value, factor) {
    return this.polarToCartesian(this.valueToDegrees(value), factor);
  };



  // Co-ordinate system utilities.

  this.degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  // Convert polar coordinate - specified by angle t (in degrees,
  // where 0 degrees is upwards) and distance r (as proportion of
  // radius, so 0 is centre and 1 is at circumference) - into
  // Cartesian coordinate.
  this.polarToCartesian = function(t, r) {
    // We add 90 degrees to t here so that t=0 degrees means "upwards"
    // (otherwise it means "to the left", which is just weird).
    var radians = this.degreesToRadians(t + 90);
    return {
      x: this.config.cx - this.config.radius * r * Math.cos(radians),
      y: this.config.cy - this.config.radius * r * Math.sin(radians)
    };
  };



  // Drawing utilities.

  this.rotateElement = function(element, fromAngle, toAngle, centre_x, centre_y, duration) {
    element.transition()
        .duration(duration)
        .attrTween("transform", function() {
          return function(step) {
            var dest = fromAngle + (toAngle - fromAngle) * step;
            return "rotate("+ dest +","+ centre_x + ","+ centre_y +")";
          };
        });
  };

  // initialization
  this.configure(configuration);
}

exports.Gauge = Gauge;
