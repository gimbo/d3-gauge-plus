module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['d3-gauge-plus.js', 'demo/js/d3-gauge*.js']
    },

    jslint: {
      src: ['d3-gauge-plus.js', 'demo/js/d3-gauge*.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-jslint');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'jslint']);

};
