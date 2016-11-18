module.exports = function (grunt) {
  var requireJsModules = [];  
  grunt.file.expand({cwd:"./src"}, "**/*.js").forEach( function (file) {
    requireJsModules.push(file.replace(/\.js$/, ''));
  });
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
        report: "gzip"
      },
      build: {
        expand: true,
        cwd: 'src/',
        src: '**/*',
        dest:'dist/',
        ext: '.min.js'
      }
    },
    requirejs: {  
      options: {
        baseUrl: "./src",
        paths: {
          'jquery':'empty:'
        }
      },
      production: {
        options: {
          include: requireJsModules,
          out: "./dist/<%= pkg.name %>.min.js",
          optimize: "none"
        }
      },
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
  grunt.registerTask('default', ['jshint','clean','requirejs','uglify','copy']);
};