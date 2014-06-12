/*global module: false;*/
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      debug: {
        src: ["debug/*"]
      },
      release: {
        src: ["release/*", "docs/*"]
      }
    },
    coffeelint: {
      app: ['src/coffee/**/*.coffee'],
      options: {
        max_line_length: {
          value: 1000
        },
        no_trailing_whitespace: {
          level: "ignore"
        },
        indentation: {
          level: "ignore"
        }
      }
    },
    coffee: {
      glob_to_multiple: {
        expand: true,
        cwd: 'src/coffee/',
        src: ['**/*.coffee'],
        dest: 'debug/js',
        ext: '.js'
      }
    },
    concat: {
      debug: {
        files: {
          'debug/css/styles.css': [
            'src/css/base/base.css',
            'src/css/jquery-ui-1.10.3.custom.min.css',
            'src/css/select2.css',
            'src/css/main.css',
            'src/css/dropzone.css',
            'src/css/media.css',
            'src/css/photoview.css',
            'src/css/bootstrap.css',
            'src/css/fancybox/jquery.fancybox.css'
          ],
          'debug/js/application.js': [
            'debug/js/templates.js',
            'debug/js/helpers.js',
            'debug/js/config/*.js',
            'debug/js/main.js',
            'debug/js/controllers/*.js',
            'debug/js/views/_base/*.js',
            'debug/js/entities/_base/*.js',
            'debug/js/entities/*.js',
            'debug/js/components/**/*.js',
            'debug/js/apps/**/*.js',
          ],
          'debug/js/libs.js': [
            'src/lib/json2.js',
            'src/lib/spin.min.js',
            'src/lib/moment.min.js',
            'src/lib/storage.min.js',
            'src/lib/moment.ru.js',
            'src/lib/handlebars.js',
            'src/lib/lodash.min.js',
            'src/lib/backbone.min.js',
            'src/lib/backbone.marionette.min.js',
          ],
          'debug/js/plugins.js': [
            'src/plugins/*.js',
          ]
        }
      },
      release: {
        files: {
          'debug/css/styles.css': [
            'src/css/base/base.css',
            'src/css/jquery-ui-1.10.3.custom.min.css',
            'src/css/select2.css',
            'src/css/main.css',
            'src/css/dropzone.css',
            'src/css/media.css',
            'src/css/bootstrap.css',
            'src/css/fancybox/jquery.fancybox.css'
          ],
          'debug/js/application.js': [
            'debug/js/release-only.js',
            'debug/js/templates.js',
            'debug/js/helpers.js',
            'debug/js/config/*.js',
            'debug/js/main.js',
            'debug/js/controllers/*.js',
            'debug/js/views/_base/*.js',
            'debug/js/entities/_base/*.js',
            'debug/js/entities/*.js',
            'debug/js/components/**/*.js',
            'debug/js/apps/**/*.js',
          ],
          'debug/js/libs.js': [
            'src/lib/json2.js',
            'src/lib/spin.min.js',
            'src/lib/moment.min.js',
            'src/lib/moment.ru.js',
            'src/lib/handlebars.js',
            'src/lib/lodash.min.js',
            'src/lib/backbone.min.js',
            'src/lib/backbone.marionette.min.js',
          ],
          'debug/js/plugins.js': [
            'src/plugins/*.js',
          ]
        }
      }
    },
    copy: {
      debug: {
        files: [
          {expand: true, cwd: 'src/images/', src: ['**'], dest: 'debug/images'},
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'debug/lib'},
          {expand: true, cwd: 'src/css/', src: ['**'], dest: 'debug/css'},
        ]
      },
      release: {
        files: [
          {expand: true, cwd: 'src/images/', src: ['**'], dest: 'release/images'},
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'release/lib'},
          {expand: true, cwd: 'src/css/', src: ['**'], dest: 'release/css'},
        ]
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          syntaxtype: 'coffee',
          extension: '.coffee',
          paths: 'src/coffee/',
          outdir: 'docs/'
        }
      }
    },
    closureCompiler:  {
      options: {
        compilerFile: 'closure/compiler.jar',
        compilerOpts: {
           compilation_level: 'SIMPLE_OPTIMIZATIONS',
           externs: ['closure/jquery-1.8.ext.js'],
           //define: ['goog.DEBUG=true'],
           //output_wrapper: '(function(){%output%}).call(this);'
        },
        execOpts: {
          maxBuffer: 999999 * 1024
        }
      },
      compile: {
        src: [
          'debug/js/libs.js',
          'debug/js/plugins.js',
          'debug/js/application.js'],
        dest: 'release/js/application.js'
      }
    },
    cssmin: {
      compress: {
        files: {
          'release/css/styles.css': ['debug/css/styles.css']
        }
      }
    },
    handlebars: {
      dist: {
        options: {
          namespace: "Templates",
          //wrapped: "true",
          processName: function(filename) {
            var pieces = filename.split("/");
            pieces = pieces[pieces.length - 1];
            pieces = pieces.split(".");
            return pieces[0];
          }
        },
        files: {
          "debug/js/templates.js": ["src/coffee/**/*.html"]
        }
      }
    },
    watch: {
      scripts: {
        files: 'src/**/*',
        tasks: ['debug'],
        options: {
          debounceDelay: 100
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-closure-tools');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-handlebars-compiler');
  grunt.loadNpmTasks("grunt-contrib-handlebars");

  grunt.registerTask('debug', ['clean:debug', 'coffeelint', 'coffee', 'handlebars', 'concat:debug', 'copy:debug']);
  grunt.registerTask('default', ['debug']);
  grunt.registerTask('release', ['clean:release', 'coffeelint', 'coffee', 'handlebars', 'concat:release', 'closureCompiler:compile', 'cssmin', 'yuidoc', 'copy:release']);
  grunt.registerTask('watching', ['watch']);

};
