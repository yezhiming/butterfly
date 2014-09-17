module.exports = function(grunt) {

  /**
   * 1.清理
   * 2.用bower安装依赖
   * 3.生成stylus样式
   */
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //clean the dist before copy & compile files
    clean: {
      dist: ["dist/"],
      examples: ["examples/butterfly"]
    },

    //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
    bower: {
      install: {
        options: {
          production: false,
          targetDir: 'vendor',
          layout: 'byComponent',
          cleanup: true,
          verbose: true
        }
      }
    },

    //compile stylus to css
    stylus: {
      compile: {
        options: {
          'include css': true
        },
        files: {
          'dist/css/butterfly.css': 'stylus/butterfly.styl',
          'css/butterfly.css': 'stylus/butterfly.styl'
        }
      }
    },

    //copy the src/images and vendor to dist
    copy: {
      source: {
        files: [
          //复制butterfly的js源码到dist/js
          {
            expand: true,
            cwd: 'js/',
            src: ['**'],
            dest: 'dist/js'
          }
        ]
      },
      vendor: {
        files: [
          //复制require.js
          {
            expand: true,
            cwd: 'vendor/requirejs',
            src: ['require.js'],
            dest: 'dist/js'
          },
          //复制整个vendor目录
          {
            expand: true,
            cwd: 'vendor/',
            src: ['**'],
            dest: 'dist/vendor'
          }
        ]
      },
      //deprecated
      examples: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: 'examples/butterfly/'
        }]
      }
    },

    symlink: {
      explicit: {
        src: 'dist/',
        dest: 'examples/butterfly'
      }
    }

  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('build', [
    'clean:dist',
    'stylus:compile',
    'copy:vendor',
    'copy:source'
  ]);

  grunt.registerTask('examples', [
    'clean:examples',
    'symlink'
  ]);

  grunt.registerTask('default', [
    'build',
    'examples'
  ]);
};