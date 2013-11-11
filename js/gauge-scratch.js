var gauge_scratch = function() {

  var gauges = [];

  function createGauge(name, label, min, max) {
    var config = {
      size: 400,
      label: label,
      min: undefined != min ? min : 0,
      max: undefined != max ? max : 100,
      minorTicks: 5
    };

    var range = config.max - config.min;
    config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
    config.redZones = [{ from: config.min + range*0.9, to: config.max }];
    gauges[name] = new Gauge(name + "GaugeContainer", config);
    gauges[name].render();
  }

  function createGauges() {
    createGauge("test", "");
  }

  function updateGauges() {
    for (var key in gauges) {
      var value = getRandomValue(gauges[key])
      gauges[key].redraw(value);
    }
  }

  function getRandomValue(gauge) {
    var overflow = 0; //10;
    return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
  }

  return {
    initialize : function() {
      createGauges();
      updateGauges();
      setInterval(updateGauges, 3000);
    }
  };

}();
