/*jslint node: true */
/*jslint white: true */

"use strict";

module.exports = function(grunt) {

  var toLint = [
    'Gruntfile.js',
    'lib/main.js',
    'lib/disk.js',
    'lib/gauge.js',
    'demo/js/d3-gauge*.js'
    ];

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'dist/d3-gauge-plus.js': ['lib/main.js']
        }
      }
    },

    jshint: {
      all: toLint
    },

    jslint: {
      src: toLint
    },

    uglify: {
      d3_gauge_plus_min: {
        files: {
          'dist/d3-gauge-plus.min.js': ['dist/d3-gauge-plus.js']
        }
      }
    },

    watch: {
      js: {
        files: ['lib/*.js'],
        tasks: ['browserify', 'jshint', 'jslint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jslint', 'browserify', 'uglify']);

};
