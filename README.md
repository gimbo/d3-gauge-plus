# `d3-gauge-plus.js` - Advanced guages in d3

This is a fork of Tomer Doron's [gauge.js](https://gist.github.com/tomerd/1499279) implementation of "[google style gauge's using d3.js](http://tomerdoron.blogspot.co.uk/2011/12/google-style-gauges-using-d3js.html)".  It adds lots more configuration options, including the ability to rotate the gauge and change the size of the gap, and will (shortly) allow dynamic updating of the coloured bands (useful for, e.g., [TCAS](http://en.wikipedia.org/wiki/Traffic_collision_avoidance_system) simulations) and variable-size ranges.

[Live demo here](http://gimbo.github.io/d3-gauge-plus/demo/).

## Using `d3-gauge-plus.js`

If you just want to use the module to create gauges, you can grab the [`d3-gauge-plus.js` from the top level of this repository](https://github.com/gimbo/d3-gauge-plus/blob/master/d3-gauge-plus.js) and include it in your projects.  See the [demos page](http://gimbo.github.io/d3-gauge-plus/demo/) (and [accompanying source](https://github.com/gimbo/d3-gauge-plus/tree/master/demo) in the repository) for more information.

## Building `d3-gauge-plus.js`

If you want to modify the code, you'll need to rebuild it from its constituent parts.  The relevant modules are in the [lib](https://github.com/gimbo/d3-gauge-plus/tree/master/lib) folder; they are compiled into the top-level `d3-gauge-plus.js` library using [browserify](http://browserify.org/) under the control of [grunt](http://gruntjs.com/) - see [Gruntfile.js](https://github.com/gimbo/d3-gauge-plus/blob/master/Gruntfile.js).
