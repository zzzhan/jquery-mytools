module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
		files: {
		  'dist/<%= pkg.name %>.min.js':'src/*.js'
		}
      }
    },
	copy: {
      build: {
	    expand: true,
	    cwd: 'src/',
	    src: ['*.*'],
	    dest:'dist/'	
      }
	},
    clean: ['dist']
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint','clean','uglify','copy']);
};