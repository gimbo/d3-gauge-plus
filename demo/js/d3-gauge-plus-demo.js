/*jslint indent: 2 */
/*jslint white: true */

/*global d3_gauge_plus */
/*global setInterval */

var d3_gauge_plus_demo = (function() {

  "use strict";

  var demoGauge;

  function createGauge(name, minValue, maxValue) {

    var config,
        range;

    config = {

      size: 500,
      rotation: 270,
      gap: 45,

      drawOuterCircle: false,
      innerStrokeColor: "#fff",

      label: "demo",
      labelSize: 1.2,
      labelColor: "#CCC",

      min: minValue,
      max: maxValue,
      initial: minValue,

      transitionDuration: 300
    };
    range = config.max - config.min;

    function zone(start, end) {
      return { from: config.min + range * start, to: config.min + range * end };
    }

    config.greenZones = [zone(0.3, 0.5), zone(0.6, 0.75)];
    config.yellowZones = [zone(0.75, 0.9)];
    config.redZones = [zone(0, 0.2), zone(0.9, 1)];
    return new d3_gauge_plus.Gauge(name + "GaugeContainer", config);
  }

  // function updateGaugeRandom(gauge) {
  //   function getRandomValue(gauge) {
  //     var overflow = 0; //10;
  //     return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
  //   }
  //   var value = getRandomValue(gauge);
  //   gauge.setPointer(value);
  // }

  function tick(gauge) {
    var newValue = gauge.pointerValue + 1;
    if (newValue > gauge.config.max + 1) {
      newValue = gauge.config.min - 1;
    }
    demoGauge.setPointer(newValue);
  }

  function diskDemos() {

    d3_gauge_plus.disk.createDisk({
        name: "diskTesting1"
      }).drawCircle(0.95, { fill: "#ccc" })
        .drawCircle(0.85, { fill: "#fff",
                            stroke: "#ccc",
                            "stroke-width": "0.5px"})
        .drawArc(0, 90, 0.65, 0.85)
        .drawArc(135, 310, 0.25, 0.35, { fill: "green" })
        .drawArc(180, 210, 0.75, 0.9, { fill: "yellow" });

    d3_gauge_plus.disk.createDisk({
        name: "diskTesting2",
        radius: 150
      }).drawCircle(0.95, { fill: "red" })
        .drawCircle(0.85, { fill: "yellow",
                            stroke: "#ccc",
                            "stroke-width": "5px" })
        .drawArc(195, 340, 0.25, 0.45, { fill: "green" })
        .drawRadial(35, 0.4, 0.8, { "stroke-width": "2px" })
        .drawRadial(45, 0.4, 0.8, { "stroke-width": "2px" })
        .drawRadial(55, 0.4, 0.8, { "stroke-width": "2px" })
        .drawRadial(65, 0.4, 0.8, { "stroke-width": "2px" });

    d3_gauge_plus.disk.createDisk({
        name: "diskTextDemo1",
        radius: 150
      }).drawCircle(0.95, { fill: "#fff" })
        .drawText(0, 0.75, 0, 0.2, "0")
        .drawText(90, 0.75, 90, 0.2, "90")
        .drawText(180, 0.75, 180, 0.2, "180")
        .drawText(270, 0.75, 270, 0.2, "270")
        .drawRadial(0, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(90, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(180, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(270, 0.4, 0.7, { "stroke-width": "2px" });

    d3_gauge_plus.disk.createDisk({
        name: "diskTextDemo2",
        radius: 150
      }).drawCircle(0.95, { fill: "#fff" })
        .drawText(0, 0.75, 0, 0.2, "0")
        .drawText(90, 0.75, 0, 0.2, "90")
        .drawText(180, 0.75, 0, 0.2, "180")
        .drawText(270, 0.75, 0, 0.2, "270")
        .drawRadial(0, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(90, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(180, 0.4, 0.7, { "stroke-width": "2px" })
        .drawRadial(270, 0.4, 0.7, { "stroke-width": "2px" });
  }

  return {
    initialize : function() {
      demoGauge = createGauge("demo", -6, 6);
      demoGauge.render();
      // demoGauge.setPointer(-5, 0);
      // for (var i=0; i<20; i++) {
      //   setTimeout(function() { tick(demoGauge); }, 1000 * i);
      // }

      // setInterval(function() { updateGaugeRandom(demoGauge); }, 300);
      // setTimeout(function() { tick(demoGauge); }, 1500);
      setInterval(function() { tick(demoGauge); }, 1500);
      diskDemos();
    }
  };

}());
