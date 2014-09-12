({
	baseUrl: ".",
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
		css: 'vendor/require-css/css',
		view: 'js/requirejs-butterfly',
		// lib
		jquery: 'vendor/jquery/jquery',
		underscore: 'vendor/underscore/underscore',
		backbone: 'vendor/backbone/backbone',
		fastclick: 'vendor/fastclick/fastclick',
		iscroll: 'vendor/iscroll/iscroll-probe',
		moment: 'vendor/moment/moment',
		spin: 'vendor/spinjs/spin',
		// hogan
		hogan: 'vendor/requirejs-hogan-plugin/hogan',
		hgn: 'vendor/requirejs-hogan-plugin/hgn'
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
  out: "dist/js/butterfly-dist.js",
  optimize: "none"//uglify
})
