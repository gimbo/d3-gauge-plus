var gauge_scratch = function() {

  var tcasGauge;

  function createGauge(name, minValue, maxValue) {
    var config = {
      size: 500,
      drawOuterCircle: false,
      innerStrokeColor: "#fff",
      min: minValue,
      max: maxValue,
      rotation: 0,
      gap: 90,
      transitionDuration: 500
    };

    var gauge;
    var range = config.max - config.min;

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
    gauge.redraw(value);
  }

  function tick(gauge) {
    var newValue = gauge.pointerValue + 1;
    if (newValue > gauge.config.max + 1) {
      newValue = gauge.config.min - 1;
    }
    tcasGauge.setPointer(newValue, 1000);
  }

  return {
    initialize : function() {
      tcasGauge = createGauge("tcas", -6, 4);
      tcasGauge.render();
      // tcasGauge.setPointer(-5, 0);
      // for (var i=0; i<20; i++) {
      //   setTimeout(function() { tick(tcasGauge); }, 1000 * i);
      // }

      // setTimeout(function() { tick(tcasGauge); }, 1500);
      setInterval(function() { tick(tcasGauge); }, 1500);
    }
  };

}();
