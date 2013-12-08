# `d3-gauge-plus.js` - Advanced guages in d3

This is a fork of Tomer Doron's [gauge.js](https://gist.github.com/tomerd/1499279) implementation of "[google style gauge's using d3.js](http://tomerdoron.blogspot.co.uk/2011/12/google-style-gauges-using-d3js.html)".  It adds lots more configuration options, including the ability to rotate the gauge and change the size of the gap, and will (shortly) allow dynamic updating of the coloured bands (useful for, e.g., [TCAS](http://en.wikipedia.org/wiki/Traffic_collision_avoidance_system) simulations) and variable-size ranges.

[Live demo here](http://gimbo.github.io/d3-gauge-plus/demo/).

## Using `d3-gauge-plus.js`

If you just want to use the module to create gauges, you can grab the file [`d3-gauge-plus.js`](https://github.com/gimbo/d3-gauge-plus/blob/master/dist/d3-gauge-plus.js) from the [`dist`](https://github.com/gimbo/d3-gauge-plus/tree/master/dist) folder in this repository (or if you prefer, [the minified version](https://github.com/gimbo/d3-gauge-plus/blob/master/dist/d3-gauge-plus.min.js)) and include it in your projects.  See the [demos page](http://gimbo.github.io/d3-gauge-plus/demo/) (and [accompanying source](https://github.com/gimbo/d3-gauge-plus/tree/master/demo) in the repository) for more information.

## Building `d3-gauge-plus.js`

If you want to modify the library, you'll need to rebuild it from its constituent parts.  We use [grunt](http://gruntjs.com/) to compile the sources (which are in [lib](https://github.com/gimbo/d3-gauge-plus/tree/master/lib)) to the target `d3-gauge-plus.js` library using [browserify](https://npmjs.org/package/grunt-browserify), and then minify that to `d3-gauge-plus.min.js` using [uglify](https://github.com/gruntjs/grunt-contrib-uglify).

To get started, you need to do two things:

First, ensure you've got grunt installed.  Hopefully that's as simple as:

    npm install -g grunt-cli

[More detailed instructions are here](http://gruntjs.com/getting-started).

Second, in the root folder of this repository, install dependencies via:

    npm install

Then you should be able to run `grunt` to lint/browserify/minify the sources all together.  It's all controleld by [Gruntfile.js](https://github.com/gimbo/d3-gauge-plus/blob/master/Gruntfile.js).
