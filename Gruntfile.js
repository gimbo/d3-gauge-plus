module.exports = function(grunt) {

  var toLint = [
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
          'd3-gauge-plus.js': ['lib/main.js']
        }
      }
    },

    jshint: {
      all: toLint
    },

    jslint: {
      src: toLint
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
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['browserify', 'jshint', 'jslint']);

};
