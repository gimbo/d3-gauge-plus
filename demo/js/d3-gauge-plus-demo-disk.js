/*jslint indent: 2 */
/*jslint white: true */

/*global d3_gauge_plus */
/*global setInterval */

var d3_gauge_plus_demo_disk = (function() {

  "use strict";

  function diskDemos() {



    d3_gauge_plus.disk.createDisk({
      name: "diskScratch",
      radius: 200
    }).drawCircle(0.5, { fill: "white" })
      .drawCircle(0.2, { fill: "white" })
      .drawText(0, 0, 0, 0.2, "X")
      .drawText(90, 0.5, 90, 0.2, "X");



    d3_gauge_plus.disk.createDisk({
        name: "diskEmpty"
      });

    d3_gauge_plus.disk.createDisk({
        name: "diskEmptyNoBorder",
        classes: "noborder"
      });

    d3_gauge_plus.disk.createDisk({
        name: "diskEmptyRadius50",
        radius: 50
      });



    d3_gauge_plus.disk.createDisk({
        name: "diskCircles1",
      }).drawCircle(1);

    d3_gauge_plus.disk.createDisk({
        name: "diskCircles2",
      }).drawCircle(1.2, { fill: "red",
                           stroke: "none" })
        .drawCircle(0.8, { fill: "white",
                           stroke: "blue",
                           "stroke-width": "5px" })
        .drawCircle(0.3, { fill: "green" })
        .drawCircle(0.4, { fill: "yellow" })
        .drawCircle(0.5, { fill: "none" });



    d3_gauge_plus.disk.createDisk({
        name: "diskStyles",
        defaultStyles: {
          fill: "none",
          "stroke-width": "3px"
        }
      }).drawCircle(0.9)
        .drawCircle(0.7)
        .drawCircle(0.5, { stroke: "green",
                           fill: "blue" })
        .drawCircle(0.3, { fill: "yellow" })
        .drawCircle(0.2, { stroke: "red" });



    d3_gauge_plus.disk.createDisk({
        name: "diskRadial1",
        defaultStyles: {
          "stroke-width": "2px"
        }
      }).drawRadial(0, 0, 1)
      .drawRadial(30, 0, 1)
      .drawRadial(60, 0, 1)
      .drawRadial(90, 0, 1)
      .drawRadial(180, 0.2, 0.9)
      .drawRadial(250, 0.3, 0.8, {
        stroke: "green",
        "stroke-width": "10px"
      })
      .drawRadial(270, 0.7, 0.2);

    var radial2 = d3_gauge_plus.disk.createDisk({
        name: "diskRadial2"
      });
    for (var i=1; i <= 80; i++) {
      var frac = i/80,
        color = Math.floor(255 * (1-frac));
      radial2.drawRadial(360 * 3 * frac, 0.68 * frac, 0.9 * frac, {
        stroke: "rgb(255," + color + "," + color + ")"
      });
    }



    d3_gauge_plus.disk.createDisk({
        name: "diskArc1"
    }).drawArc(0, 90, 0.5, 0.6)
      .drawArc(180, 270, 0, 1, {
        fill: "yellow",
        stroke: "red",
        "stroke-width": "0.5px"
      })
      .drawArc(135, 225, 0.3, 0.8, {
        fill: "none"
      })
      .drawArc(330, 290, 1.2, 0.8, {
        fill: "red",
        stroke: "none"
      })
      .drawArc(300, 320, 0.6, 1, {
        fill: "rgba(0, 0, 255, 0.5)"
      });



    d3_gauge_plus.disk.createDisk({
      name: "diskTextCentering",
      radius: 150,
      defaultStyles: {
        "font-family": "Helvetica, Arial"
      }
    }).drawCircle(0.8, { fill: "white" })
      .drawCircle(0.2, { fill: "white" })
      .drawText(0, 0, 0, 0.4, "X")
      .drawText(90, 0.8, 90, 0.4, "X");

    d3_gauge_plus.disk.createDisk({
        name: "diskText1",
        defaultStyles: {
          "font-family": "Helvetica, Arial"
        }
      }).drawText(45, 0.8, 0, 0.3, "hello")
        .drawText(235, 0.5, 85, 0.4, "world", {
          "font-family": "Courier New",
          "fill": "red"
        });

    var diskText2 = d3_gauge_plus.disk.createDisk({
        name: "diskText2",
        radius: 150
      });
    for (var angle=0; angle < 360; angle += 45) {
      diskText2.drawText(angle, 0.75, angle, 0.2, "" + angle);
      diskText2.drawRadial(angle, 0.2, 0.75, {
        "stroke-width": "0.5px"
      });
    };

    var diskText3 = d3_gauge_plus.disk.createDisk({
        name: "diskText3",
        radius: 150
      });
    for (var angle=0; angle < 360; angle += 45) {
      diskText3.drawText(angle, 0.75, 0, 0.2, "" + angle);
      diskText3.drawRadial(angle, 0.2, 0.75, {
        "stroke-width": "0.5px"
      });
    };



    d3_gauge_plus.disk.createDisk({
        name: "diskCombined",
        radius: 200,
        defaultStyles: {
          fill: "blue",
          "font-family": "Georgia",
          "stroke-width": "3px"
        }
      }).drawCircle(0.98, { fill: "#ccc" })
        .drawCircle(0.85, { fill: "#fff",
                            stroke: "#ccc",
                            "stroke-width": "0.5px"})
        .drawArc(0, 90, 0.65, 0.85)
        .drawText(200, 0.8, 0, 0.1, "Peekaboo")
        .drawArc(180, 280, 0.75, 0.9, { stroke: "yellow",
                                        "stroke-width": "2.5px",
                                        fill: "rgba(255, 0, 255, 0.3)"
                                      })
        .drawCircle(0.15, { fill: "red" })
        .drawRadial(45, 0.4, 0.7, { "stroke-width": "5px" })
        .drawRadial(55, 0.4, 0.7, { "stroke-width": "8px" })
        .drawRadial(305, 0.4, 0.7, { "stroke": "red" })
        .drawRadial(315, 0.4, 0.7)
        .drawArc(115, 245, 0.55, 0.65, { fill: "green" })
        .drawText(45, 1.1, 45, 0.15, "Disks!");



    }

  return {
    initialize : function() {
      diskDemos();
    }
  };

}());
