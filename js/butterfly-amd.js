require.config({
	baseUrl: '../',
	packages: [{
		name: 'butterfly',
		location: 'butterfly/js',
		main: 'butterfly'
	}],
	paths: {
		// require.js plugins
		text: 'butterfly/vendor/requirejs-text/text',
		domReady: 'butterfly/vendor/requirejs-domready/domready',
		i18n: 'butterfly/vendor/requirejs-i18n/i18n',
		view: 'butterfly/js/view-plugin',
		// lib
		jquery: 'butterfly/vendor/jquery/jquery',
		underscore: 'butterfly/vendor/underscore/underscore',
		backbone: 'butterfly/vendor/backbone/backbone',
		fastclick: 'butterfly/vendor/fastclick/fastclick',
		iscroll: 'butterfly/vendor/iscroll/iscroll-probe',
		moment: 'butterfly/vendor/moment/moment'
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
