/*jslint indent: 2 */
/*jslint nomen: true*/
/*jslint white: true */

/*global _ */
/*global d3 */

var d3_gauge_plus = (function() {

  "use strict";

  // A context for drawing into SVG using polar co-ordinates.
  var disk = (function() {

    var diskProto = {

      name: "defaultDisk",
      radius: 200,
      classes: "disk",

      degreesToRadians: function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
      },

      /**
       * Convert from polar to cartesian co-ordinates.
       * @param t Angle in degrees, where 0 degrees is upwards.
       * @param r Distance from disk's centre, as a proportion of the
       *     disk's radius (i.e. a number between 0 and 1).
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
       * Draw a circle.
       * @param radius Radius of circle, as a proportion of the disk's
       *     radius (i.e. a number between 0 and 1).
       * @param fillColor A string, the fill colour for the circle,
       *     e.g. "#000".
       * @param strokeColor A string, the stroke colour for the circle,
       *     e.g. "#000".
       * @param strokeWidth A string, the stroke width for the circle,
       *     e.g. "1px".
       */
      drawCircle: function drawCircle(radius, fillColor, strokeColor, strokeWidth) {
        var circle = this.body.append("svg:circle")
            .attr("cx", this.radius)
            .attr("cy", this.radius)
            .attr("r", this.radius * radius);
        if (fillColor !== undefined) {
          circle.style("fill", fillColor);
        }
        if (strokeColor !== undefined) {
          circle.style("stroke", strokeColor);
        }
        if (strokeWidth !== undefined) {
          circle.style("stroke-width", strokeWidth);
        }
        return this;
      },

      /**
       * Draw an arc.
       * @param startAngle Start angle of arc, in degrees.
       * @param endAngle End angle of arc, in degrees.
       * @param innerRadius Inner radius of arc, as a proportion of
       *     the disk's radius (i.e. a number between 0 and 1).
       * @param outerRadius Outer radius of arc, as a proportion of
       *     the disk's radius (i.e. a number between 0 and 1).
       * @param fillColor Arc's colour, a string, e.g. "#000".
       */
      drawArc: function drawArc(startAngle, endAngle, innerRadius,
        outerRadius, fillColor) {
        var self = this,
          arc = this.body.append("svg:path")
              .style("fill", fillColor);
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
       * Draw a radial line.
       * @param angle Angle at which to draw radial, in degrees.
       * @param innerRadius Inner limit of radial, as a proportion of
       *     the disk's radius (i.e. a number between 0 and 1).
       * @param outerRadius Outer limit of radial, as a proportion of
       *     the disk's radius (i.e. a number between 0 and 1).
       * @param strokeColor Radial's colour, a string, e.g. "#000".
       * @param strokeWidth Width of radial, a string, e.g. "1px".
       */
      drawRadial: function drawRadial(angle, innerRadius, outerRadius,
        strokeColor, strokeWidth) {
        var start = this.polarToCartesian(angle, innerRadius),
          end = this.polarToCartesian(angle, outerRadius);
        this.body.append("svg:line")
          .attr("x1", start.x)
          .attr("y1", start.y)
          .attr("x2", end.x)
          .attr("y2", end.y)
          .style("stroke", strokeColor)
          .style("stroke-width", strokeWidth);
        return this;
      },

      /**
       * Draw some text.
       * @param angle Angular component of polar co-ordinate at which
       *     to draw text.
       * @param radius Radial component of polar co-ordinate at which
       *     to draw text; a proportion of the disk's radius (i.e. a
       *     number between 0 and 1).
       * @param rotation Angle by which to rotate text (0 is no
       *     rotation).
       * @param text The text to draw.
       * @param fillColor Text color, a string, e.g. "#000".
       * @param fontSize Font size, as a proportion of the disk's
       *     radius (i.e. a number between 0 and 1).
       */
      drawText: function drawText(angle, radius, rotation, text, fillColor,
        fontSize) {
        var loc = this.polarToCartesian(angle, radius),
          size = Math.floor(this.radius * fontSize);
          // dy = Math.floor((this.radius * fontSize) / 2);
        // loc.y = loc.y - dy;
        this.body.append("svg:text")
            .attr("x", loc.x)
            .attr("y", loc.y) // this.config.cy / 2 + fontSize / 2)
            .attr("dy", 0) // dy) // fontSize / 2)
            .attr("text-anchor", "middle")
          .text(text)
            .style("font-size", size + "px")
            .style("fill", fillColor)
            .style("stroke-width", "0px")
          .attr("transform", function() {
            return "rotate(" + rotation + "," + loc.x + "," + loc.y + ")";
          });
        return this;
      }

    };

    return {
      createDisk: function createDisk(config) {
        var newDisk = _.extend({}, diskProto, config);
        // console.log("CreateDisk", config, newDisk);
        newDisk.body = d3.select("#" + newDisk.name)
          .append("svg:svg")
          .attr("class", newDisk.classes)
          .attr("width", newDisk.radius * 2)
          .attr("height", newDisk.radius * 2);
        return newDisk;
      }
    };

  }());

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
        labelSize: 1.0, // 1.0 is 1/9 of overall size
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
      this.body = d3.select("#" + this.gaugeName)
        .append("svg:svg")
          .attr("class", "gauge")
          .attr("width", this.config.size)
          .attr("height", this.config.size);

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
        this.body.append("svg:circle")
            .attr("cx", this.config.cx)
            .attr("cy", this.config.cy)
            .attr("r", this.config.radius)
            .style("fill", this.config.outerFillColor)
            .style("stroke", this.config.outerStrokeColor)
            .style("stroke-width", "0.5px");
      }

      // Inner circle
      this.body.append("svg:circle")
          .attr("cx", this.config.cx)
          .attr("cy", this.config.cy)
          .attr("r", 0.9 * this.config.radius)
          .style("fill", this.config.innerFillColor)
          .style("stroke", this.config.innerStrokeColor)
          .style("stroke-width", "0.5px");
    };

    this.renderLabel = function() {
      var fontSize;
      if (undefined !== this.config.label) {
        fontSize = Math.round(this.config.labelSize * this.config.size / 9);
        this.body.append("svg:text")
            .attr("x", this.config.cx)
            .attr("y", this.config.cy / 2 + fontSize / 2)
            .attr("dy", fontSize / 2)
            .attr("text-anchor", "middle")
          .text(this.config.label)
            .style("font-size", fontSize + "px")
            .style("fill", this.config.labelColor)
            .style("stroke-width", "0px");
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
      this.body.selectAll(".gaugeBand").remove();
    };

    this.drawBand = function(start, end, color) {
      if (0 >= end - start) {
        return;
      }
      this.body.append("svg:path")
          .style("fill", color)
          .attr("class", "gaugeBand")
          .attr("d", d3.svg.arc()
              .startAngle(this.valueToRadians(start))
              .endAngle(this.valueToRadians(end))
              .innerRadius(0.65 * this.config.radius)
              .outerRadius(0.85 * this.config.radius))
          .attr("transform", function() {
            return "translate(" + self.config.cx + ", " + self.config.cy + ")";
          });
    };

    this.renderTicks = function() {
      var majorDelta,
        minorDelta,
        major,
        minor;
      // Render major ticks.
      if (this.config.majorTicks <= 0) {
        return;
      }
      majorDelta = this.config.range / (this.config.majorTicks - 1);
      for (major = this.config.min; major <= this.config.max; major += majorDelta) {
        // Render minor ticks.
        minorDelta = majorDelta / this.config.minorTicks;
        for (minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta) {
          this.drawLine(this.valueToPoint(minor, 0.75),
                        this.valueToPoint(minor, 0.85),
                        this.config.minorTickColor,
                        this.config.minorTickWidth);
        }
        this.drawLine(this.valueToPoint(major, 0.7),
                      this.valueToPoint(major, 0.85),
                      this.config.majorTickColor,
                      this.config.majorTickWidth);

        // Render numbers.
        this.drawText(this.valueToPoint(major, 0.58),
                      parseFloat(major.toFixed(2)),
                      Math.round(this.config.size / 20),
                      this.config.majorTickColor);
      }
    };

    this.renderPointer = function() {
      var pointerContainer,
        pointerPath,
        pointerLine,
        fontSize;
      pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
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
      fontSize = Math.round(this.config.labelSize * this.config.size / 9);
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
        pointerContainer = this.body.select(".pointerContainer");
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

    this.drawLine = function(point1, point2, color, width) {
      this.body.append("svg:line")
          .attr("x1", point1.x)
          .attr("y1", point1.y)
          .attr("x2", point2.x)
          .attr("y2", point2.y)
          .style("stroke", color)
          .style("stroke-width", width);
    };

    this.drawText = function(point, text, fontSize, color) {
      this.body.append("svg:text")
          .attr("x", point.x)
          .attr("y", point.y)
          .attr("dy", fontSize / 3)
          .attr("text-anchor", "middle")
        .text(text)
          .style("font-size", fontSize + "px")
          .style("fill", color)
          .style("stroke-width", "0px");
    };

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

  // Module interface.
  return {
    Gauge: Gauge,
    disk: disk
  };

}());
