gulp = require('gulp')
amdOptimize = require("amd-optimize")
rjs = require('requirejs')
concat = require('gulp-concat')
uglify = require("gulp-uglify")
coffee = require("gulp-coffee")
less = require("gulp-less")
sourcemaps = require('gulp-sourcemaps')

amdConfig =
  paths:
    # require.js plugins
    text: 'vendor/requirejs-text/text'
    domReady: 'vendor/requirejs-domready/domready'
    i18n: 'vendor/requirejs-i18n/i18n'
    css: 'vendor/require-css/css'
    view: 'js/requirejs-butterfly'
    # lib
    jquery: 'vendor/jquery/jquery'
    underscore: 'vendor/underscore/underscore'
    backbone: 'vendor/backbone/backbone'
    fastclick: 'vendor/fastclick/fastclick'
    iscroll: 'vendor/iscroll/iscroll-probe'
    moment: 'vendor/moment/moment'
    spin: 'vendor/spinjs/spin'
    # hogan
    hogan: 'vendor/requirejs-hogan-plugin/hogan'
    hgn: 'vendor/requirejs-hogan-plugin/hgn'

  shim:
    iscroll: {exports: 'IScroll'}
    fastclick: {exports: 'FastClick'}

  exclude: ['jquery', 'backbone']


gulp.task 'default', ->

  gulp.src "js/**/*.js"
  .pipe amdOptimize "butterfly", amdConfig
  .pipe concat "index.js"
  .pipe gulp.dest "demo-dist"

gulp.task 'less', ->

  gulp.src 'less/**/*.less'
  .pipe sourcemaps.init()
  .pipe less()
  # By default, gulp-sourcemaps writes the source maps inline in the compiled CSS files.
  # To write them to a separate file, specify a relative file path in the sourcemaps.write() function
  # sourcemaps.write('./maps')
  .pipe sourcemaps.write()
  .pipe gulp.dest 'dist/css'

# https://github.com/phated/requirejs-example-gulpfile/blob/master/gulpfile.js
gulp.task 'build-rjs', ->

  rjs.optimize
    baseUrl: "."
