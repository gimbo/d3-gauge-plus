function Gauge(gaugeName, configuration) {

  this.gaugeName = gaugeName;

  var self = this; // for internal d3 functions

  this.configure = function(configuration) {

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

    var defaults = {

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

    for (var key in defaults) {
      setConfig(key, defaults[key]);
    }

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

    console.log(this.config);
  };

  this.render = function() {
    this.body = d3.select("#" + this.gaugeName)
              .append("svg:svg")
              .attr("class", "gauge")
              .attr("width", this.config.size)
              .attr("height", this.config.size);

    this.renderDisk();
    this.renderLabel();
    this.renderRegions();
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
    if (undefined != this.config.label) {
      var fontSize = Math.round(this.config.labelSize * this.config.size / 9);
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

  this.renderRegions = function() {
    function renderOneRegion(region, color) {
      var i;
      for (i in region) {
        self.drawBand(region[i].from, region[i].to, color);
      }
    }
    renderOneRegion(this.config.greenZones, this.config.greenColor);
    renderOneRegion(this.config.yellowZones, this.config.yellowColor);
    renderOneRegion(this.config.redZones, this.config.redColor);
  };

  this.drawBand = function(start, end, color) {
    if (0 >= end - start) {
      return;
    }
    this.body.append("svg:path")
          .style("fill", color)
          .attr("d", d3.svg.arc()
            .startAngle(this.valueToRadians(start))
            .endAngle(this.valueToRadians(end))
            .innerRadius(0.65 * this.config.radius)
            .outerRadius(0.85 * this.config.radius))
          .attr("transform", function() {
            return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)";
          });
  };

  this.renderTicks = function() {
    var majorDelta;
    var minorDelta;
    var major;
    var minor;
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

      // Render number for min and max values.
      if (true || major == this.config.min || major == this.config.max) {
        this.drawText(this.valueToPoint(major, 0.58),
                      parseFloat(major.toFixed(2)),
                      Math.round(this.config.size / 20),
                      this.config.majorTickColor);
      }
    }
  };

  this.renderPointer = function() {
    var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
    var pointerPath = this.buildPointerPath();
    var pointerLine = d3.svg.line()
                  .x(function(d) { return d.x })
                  .y(function(d) { return d.y })
                  .interpolate("basis");
    var pointer = pointerContainer.selectAll("path");
    pointer.data([pointerPath])
      .enter()
      .append("svg:path")
      .attr("d", pointerLine)
      .style("fill", "#dc3912")
      .style("stroke", "#c63310")
      .style("fill-opacity", 0.7);
  };

  // Compute points for initial pointer state.
  this.buildPointerPath = function() {
    var thinness = 13;
    var delta = this.config.range / thinness;
    // We start out pointing to the minimum value.
    this.pointerValue = this.config.min;
    this.pointerAngle = this.valueToDegrees(this.pointerValue);
    var head = this.degreesToPoint(this.pointerAngle, 0.65);
    var head1 = this.degreesToPoint(this.pointerAngle - 15, 0.12);
    var head2 = this.degreesToPoint(this.pointerAngle + 15, 0.12);
    var tailAngle = this.pointerAngle + 180;
    var tail = this.degreesToPoint(tailAngle, 0.28);
    var tail1 = this.degreesToPoint(tailAngle - 15, 0.12);
    var tail2 = this.degreesToPoint(tailAngle + 15, 0.12);
    return [head, head1, tail2, tail, tail1, head2, head];
  };

  this.setPointer = function(newValue, duration) {
    var valueForAngle;
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
    var oldAngle = this.pointerAngle;
    var newAngle = self.valueToDegrees(valueForAngle) + 90 - this.config.rotation - (this.config.gap / 2);
    this.pointerAngle = newAngle;
    this.pointerValue = newValue;
    this.rotateElement(this.body.select(".pointerContainer").selectAll("path"),
                       oldAngle,
                       newAngle,
                       self.config.cx,
                       self.config.cy,
                       duration);
  };

  // 0 degrees seems to be "pointing to the left".
  this.valueToDegrees = function(value) {
    // Value as a proportion of the range.  Somewhere between 0 and 1
    // (or slightly out of that ranfge for underflow/overflow).
    var valueProp = (value - this.config.min) / this.config.range; // 0 to 1
    // 0 rotation (in config) means gap at bottom.  But in drawing
    // terms, 0 degrees is to the left, so we rotate everything by 270
    // degrees to get 0 degrees to point to the bottom, then rotate by
    // half of whatever gap has been requested in order to centre the
    // gap there.  Finally add whatever rotation the config asks for.
    var rotate = 270 + (this.config.gap / 2) + this.config.rotation;
    // arc is the number of degrees covered by the gauge - it defaults
    // to 270 (ie a gap of 90 degrees).
    var arc = 360 - this.config.gap;
    var angleFromStart = valueProp * arc + rotate;
    return angleFromStart;

  };

  this.degreesToRadians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  this.valueToRadians = function(value) {
    return this.degreesToRadians(this.valueToDegrees(value));
  };

  // Need to convert from polar to rectangular co-ordinates here, right?
  this.degreesToPoint = function(degrees, distance) {
    return {
      x: this.config.cx - this.config.radius * distance * Math.cos(this.degreesToRadians(degrees)),
      y: this.config.cy - this.config.radius * distance * Math.sin(this.degreesToRadians(degrees))
    };
  };

  this.valueToPoint = function(value, factor) {
    return {
      x: this.config.cx - this.config.radius * factor * Math.cos(this.valueToRadians(value)),
      y: this.config.cy - this.config.radius * factor * Math.sin(this.valueToRadians(value))
    };
  };

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
    element
      .transition()
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
