var d3_gauge_plus_demo = function() {

  var demoGauge;

  function createGauge(name, minValue, maxValue) {

    var config,
        gauge,
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
    return new Gauge(name + "GaugeContainer", config);
  }

  function updateGaugeRandom(gauge) {
    function getRandomValue(gauge) {
      var overflow = 0; //10;
      return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
    }
    var value = getRandomValue(gauge);
    gauge.setPointer(value);
  }

  function tick(gauge) {
    var newValue = gauge.pointerValue + 1;
    if (newValue > gauge.config.max + 1) {
      newValue = gauge.config.min - 1;
    }
    demoGauge.setPointer(newValue);
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
    }
  };

}();
