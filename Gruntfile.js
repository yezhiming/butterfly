module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//compile stylus to css
		stylus: {
			compile: {
				options: {
					'include css': true
				},
				files: {
					'dist/css/butterfly.css': 'stylus/butterfly.styl'
				}
			}
		},
		//just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
		bower: {
			install: {
				options: {
					targetDir: 'vendor',
					layout: 'byComponent',
					install: true,
					verbose: true,
					cleanTargetDir: true,
					cleanBowerDir: true
				}
			}
		},
		//copy the src/images and vendor to dist
		copy: {
			src: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['js/**', 'images/**'],
					dest: 'dist/'
				}]
			},
			examples: {
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**'],
					dest: 'examples/piece/'
				}]
			}
		},
		rename: {
			pieceInExamples: {
				src: 'examples/dist/',
				dest: 'examples/piece'
			}
		},

		//claen the dist before copy & compile files
		clean: {
			dist: ["dist/"],
			examples: ["examples/piece"],
			cache: [".sass-cache/", "temp/"]
		},
		requirejs: {
			lizard: {
				options: {
					baseUrl: ".",
					mainConfigFile: "r.config.js",
					name: "dist/js/lizard.js",
					out: "dist/js/lizard.js",
					wrap: false,
					locale: "zh-cn"
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			pieceDebug: {
				src: ['src/js/vendor/requirejs/js/require.js', 'dist/js/piece-debug.js'],
				dest: 'dist/js/piece-debug.js',
			},
			piece: {
				src: ['src/js/vendor/requirejs/js/require.js', 'dist/js/piece.js'],
				dest: 'dist/js/piece.js',
			}
		},
		uglify: {
			options: {
				mangle: true,
				beautify: false
			},
			piece: {
				files: {
					'dist/js/piece.js': ['dist/js/piece.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('build:debug', [
		'clean:dist',
		'copy:src',
		'concat:pieceDebug'
	]);

	grunt.registerTask('build:release', [
		'copy:sass',
		'requirejs:lizard',
		'concat:piece',
		'uglify:piece',
		'clean:cache'
	]);

	grunt.registerTask('examples', [
		'clean:examples',
		'copy:examples'
	]);

	grunt.registerTask('default', [
		'debug',
		'release',
		'examples'
	]);
};