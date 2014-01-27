var vendorPath = 'vendor';
require.config({
	baseUrl: '../',
	packages: [{
		name: 'butterfly',
		location: 'js',
		main: 'butterfly'
	}],
	paths: {
		// require.js plugins
		text: vendorPath + '/requirejs-text/text',
		domReady: vendorPath + '/requirejs-domready/domready',
		i18n: vendorPath +'/requirejs-i18n/i18n',
		// lib
		zepto: vendorPath + '/zepto/zepto',
		underscore: vendorPath + '/underscore/underscore',
		backbone: vendorPath + '/backbone/backbone',
		fastclick: vendorPath + '/fastclick/lib/fastclick',
		iScroll: vendorPath + '/iscroll/build/iscroll-lite',
	},
	waitSeconds: 30,
	shim: {
		zepto: {exports: '$'},
		underscore: {exports: '_'},
		backbone: {
			deps: ['underscore', 'zepto'],
			exports: 'Backbone'
		},
		'butterfly/butterfly': {
			deps: ['backbone'],
			exports: 'Butterfly'
		},

		iScroll: {exports: 'iScroll'},
		fastclick: {exports: 'FastClick'}
	}
});