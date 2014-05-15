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
		jquery: vendorPath + '/zepto/zepto',
		underscore: vendorPath + '/underscore/underscore',
		backbone: vendorPath + '/backbone/backbone',
		fastclick: vendorPath + '/fastclick/fastclick',
		iscroll: vendorPath + '/iscroll/iscroll-probe',
	},
	waitSeconds: 5,
	shim: {
		jquery: {exports: '$'},
		underscore: {exports: '_'},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		iscroll: {exports: 'IScroll'},
		fastclick: {exports: 'FastClick'}
	}
});

require(['butterfly', 'iscroll', "fastclick"],
	function(Butterfly, IScroll, FastClick){

		//iOS scroll to top
		setTimeout(function() {window.scrollTo(0, 1);}, 0);

		//enable fastclick
		FastClick.attach(document.body);
});
