({
	baseUrl: "./",
	packages: [{
		name: 'butterfly',
		location: 'js',
		main: 'butterfly'
	}],
  paths: {
		// require.js plugins
		text: 'vendor/requirejs-text/text',
		domReady: 'vendor/requirejs-domready/domready',
		i18n: 'vendor/requirejs-i18n/i18n',
		// lib
		jquery: 'vendor/jquery/jquery',
		underscore: 'vendor/underscore/underscore',
		backbone: 'vendor/backbone/backbone',
		fastclick: 'vendor/fastclick/fastclick',
		iscroll: 'vendor/iscroll/iscroll-probe',
	},
	shim: {
		jquery: {exports: '$'},
		underscore: {exports: '_'},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		iscroll: {exports: 'IScroll'},
		fastclick: {exports: 'FastClick'}
	},
  name: "js/butterfly-amd.js",
  out: "js/butterfly-dist.js",
  optimize: "uglify"
})