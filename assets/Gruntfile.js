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
            'src/css/main.css',
            'src/css/jquery-ui-1.10.0.custom.css.css',
            'src/css/**/*.css'
          ],
          'debug/js/application.js': [
            'debug/js/config.js',
            'debug/js/templates.js',
            'debug/js/helpers.js',
            'debug/js/**/module.js',
            'debug/js/**/popup.js',
            'debug/js/**/model.js',
            'debug/js/**/collection.js',
            'debug/js/**/layout.js',
            'debug/js/**/views.js',
            'debug/js/**/views/*.js',
            'debug/js/**/router.js',
            'debug/js/**/controller.js',
            'debug/js/main.js'
          ]
        }
      },
      release: {
        files: {
          'debug/js/application.js': [
            'debug/js/config.js',
            'debug/js/templates.js',
            'debug/js/helpers.js',
            'debug/js/**/module.js',
            'debug/js/**/popup.js',
            'debug/js/**/model.js',
            'debug/js/**/collection.js',
            'debug/js/**/layout.js',
            'debug/js/**/views.js',
            'debug/js/**/views/*.js',
            'debug/js/**/router.js',
            'debug/js/**/controller.js',
            'debug/js/main.js'
          ]
        }
      }
    },
    generator: {
      debug: {
        files: [
          { cwd: 'src/hbr/data', src: ['**/*'], dest: 'debug/', ext: '.html' }
        ],
        options: {
          partialsGlob: 'src/hbr/partials/*.html',
          templates: 'src/hbr/'
        }
      },
      release: {
        files: [
          { cwd: 'src/hbr/data', src: ['**/*'], dest: 'release/', ext: '.html' }
        ],
        options: {
          partialsGlob: 'src/hbr/partials/*.html',
          templates: 'src/hbr/'
        }
      }
    },
    copy: {
      debug: {
        files: [
          {expand: true, cwd: 'src/images/', src: ['**'], dest: 'debug/images'},
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'debug/lib'},
          //{expand: true, cwd: 'src/tpl/', src: ['**'], dest: 'debug/tpl'}
        ]
      },
      release: {
        files: [
          {expand: true, cwd: 'src/images/', src: ['**'], dest: 'release/images'},
          {expand: true, cwd: 'src/lib/', src: ['**'], dest: 'release/lib'},
          {expand: true, cwd: 'src/tpl/', src: ['**'], dest: 'release/tpl'}
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
           //define: ['goog.DEBUG=false'],
           //output_wrapper: '(function(){%output%}).call(this);'
        }
      },
      compile: {
        src: 'debug/js/application.js',
        dest: 'release/js/application.js'
      }
    },
    cssmin: {
      compress: {
        files: {
          'release/css/styles.css': ['src/css/main.css', 'src/css/jquery-ui-1.10.0.custom.css']
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
          "debug/js/templates.js": ["src/tpl/*.html"]
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
  grunt.loadNpmTasks('grunt-generator');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-handlebars-compiler');
  grunt.loadNpmTasks("grunt-contrib-handlebars");

  grunt.registerTask('debug', ['clean:debug', 'coffeelint', 'coffee', 'handlebars', 'concat:debug', 'copy:debug']);
  grunt.registerTask('default', ['debug']);
  grunt.registerTask('release', ['clean:release', 'coffeelint', 'coffee', 'handlebars', 'concat:release', 'closureCompiler:compile', 'cssmin', 'yuidoc', 'copy:release']);
  grunt.registerTask('watching', ['watch']);

};
