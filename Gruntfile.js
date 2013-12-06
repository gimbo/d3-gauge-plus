module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      dist: {
        files: {
          'd3-gauge-plus.js': ['lib/main.js']
        }
      }
    },

    jshint: {
      all: [
        'lib/d3-gauge-plus.js',
        'lib/disk.js',
        'lib/gauge.js',
        'demo/js/d3-gauge*.js'
      ]
    },

    jslint: {
      src: [
        'lib/d3-gauge-plus.js',
        'lib/disk.js',
        'lib/gauge.js',
        'demo/js/d3-gauge*.js'
      ]
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'jshint', 'jslint']);

};
