var vendorPath = 'butterfly/vendor';
require.config({
	baseUrl: '../',
	packages: [{
		name: 'butterfly',
		location: 'butterfly/js',
		main: 'butterfly'
	}],
	paths: {
		// require.js plugins
		text: vendorPath + '/requirejs-text/text',
		domReady: vendorPath + '/requirejs-domready/domready',
		i18n: vendorPath +'/requirejs-i18n/i18n',
		// lib
		zepto: vendorPath + '/zepto/zepto',
		jquery: vendorPath + '/zepto/zepto',
		underscore: vendorPath + '/underscore/underscore',
		backbone: vendorPath + '/backbone/backbone',
		fastclick: vendorPath + '/fastclick/lib/fastclick',
		iscroll: vendorPath + '/iscroll/iscroll-probe',
	},
	waitSeconds: 5,
	shim: {
		zepto: {exports: '$'},
		jquery: {exports: '$'},
		underscore: {exports: '_'},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'butterfly/butterfly': {
			deps: ['backbone'],
			exports: 'Butterfly'
		},

		iscroll: {exports: 'IScroll'},
		fastclick: {exports: 'FastClick'}
	}
});

require(['butterfly', 'iscroll', 'butterfly/viewloader'], function(Butterfly, IScroll, ViewLoader){
	console.log('Butterfly.js run');
	function err(err){
		console.log(err);
	}
	
	// ViewLoader.loadView('mail/index.html', function(view){
	// }, err);

	ViewLoader.loadView(document.querySelector('#container-sample'), function(view){
		
	}, err);
});