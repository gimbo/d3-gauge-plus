var gauge_scratch = function() {

  var tcasGauge;
  var current = -6;

  function createGauge(name, min, max) {
    var config = {
      size: 500,
      min: undefined != min ? min : -6,
      max: undefined != max ? max : 6,
      rotation: 0
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

  function tick() {
    current = current + 1;
    if (current > 6) {
      current = -6;
    }
    tcasGauge.setPointer(current);
  }

  return {
    initialize : function() {
      tcasGauge = createGauge("tcas", -6, 6);
      tcasGauge.render();
      tcasGauge.setPointer(-5, 0);
      setInterval(tick, 1000);
    }
  };

}();
