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
    config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
    config.redZones = [{ from: config.min + range*0.9, to: config.max }];
    return new Gauge(name + "GaugeContainer", config);
  }

  function updateGaugeRandom(gauge) {
    var value = getRandomValue(gauge);
    gauge.redraw(value);
  }

  function getRandomValue(gauge) {
    var overflow = 0; //10;
    return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
  }

  function tick() {
    current = current + 1;
    if (current > 6) {
      current = -6;
    }
    tcasGauge.redraw(current);
  }

  return {
    initialize : function() {
      tcasGauge = createGauge("tcas", -6, 6);
      tcasGauge.render();
      // updateGauge(tcasGauge);
      //setInterval(tick, 1000);
    }
  };

}();
