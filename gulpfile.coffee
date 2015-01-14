gulp = require('gulp')
# tools
del = require('del')
symlink = require('gulp-symlink')

amdOptimize = require("amd-optimize")
rjs = require('requirejs')
concat = require('gulp-concat')
coffee = require("gulp-coffee")
sourcemaps = require('gulp-sourcemaps')

# css
less = require("gulp-less")
uglify = require("gulp-uglify")
minify = require('gulp-minify-css')
# Hardcoding vendor prefixes via CSS pre-processor mixins (Less, SCSS or whatever) is a pure anti-pattern these days and considered harmful.
# http://stackoverflow.com/questions/18558368/is-there-a-generic-way-to-add-vendor-prefixes-in-less
LessPluginAutoPrefix = require('less-plugin-autoprefix')
autoprefix= new LessPluginAutoPrefix({browsers: ["last 2 versions"]})

bower = require('gulp-bower')

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

  shim:
    iscroll: {exports: 'IScroll'}
    fastclick: {exports: 'FastClick'}

  exclude: ['jquery', 'backbone']

# clean up
gulp.task 'clean', (cb)->

  del [
    'dist'
    'examples/butterfly'
    'examples/todo/butterfly'
    ], cb

gulp.task 'bower', ->

  bower('vendor/')
  # .pipe gulp.dest ''

# compile less with sourcemaps
gulp.task 'less', ->

  # gulp.src 'less/**/*.less'
  gulp.src 'less/butterfly.less'
  .pipe sourcemaps.init()
  .pipe less(plugins: [autoprefix])
  # By default, gulp-sourcemaps writes the source maps inline in the compiled CSS files.
  # To write them to a separate file, specify a relative file path in the sourcemaps.write() function
  # sourcemaps.write('./maps')
  .pipe sourcemaps.write()
  .pipe gulp.dest 'dist/css'
  # .pipe minify()
  # .pipe gulp.dest 'dist/css/butterfly-min.css'

gulp.task 'copy:src', ->

  gulp.src 'js/**/*'
  .pipe gulp.dest 'dist/js'

gulp.task 'copy:vendor', ->

  gulp.src 'vendor/**/*'
  .pipe gulp.dest 'dist/vendor'

gulp.task 'requirejs', ->

  gulp.src "js/**/*.js"
  .pipe amdOptimize "butterfly", amdConfig
  .pipe concat "index.js"
  .pipe gulp.dest "demo-dist"

# build
gulp.task 'dist', ['clean', 'less', 'copy:src', 'copy:vendor', 'requirejs']

# ln dist folder to examples
gulp.task 'symlink', ['dist'], ->

  gulp.src 'dist'
  .pipe symlink 'examples/todo/butterfly'
  .pipe symlink 'examples/butterfly'

gulp.task 'default', ['dist', 'symlink']



# https://github.com/phated/requirejs-example-gulpfile/blob/master/gulpfile.js
# gulp.task 'build-rjs', ->
#
#   rjs.optimize
#     baseUrl: "."
