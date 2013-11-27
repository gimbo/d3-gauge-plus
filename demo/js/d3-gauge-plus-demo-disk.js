/*jslint indent: 2 */
/*jslint white: true */

/*global d3_gauge_plus */
/*global setInterval */

var d3_gauge_plus_demo_disk = (function() {

  "use strict";

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
      diskDemos();
    }
  };

}());
