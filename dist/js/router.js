define(['backbone'], function(Backbone){
	'use strict';

	return Backbone.Router.extend({
		routes: {
			'*path(?*param)': 'match',
			//eg: index.html
			'': 'index',
			//eg: index.html#com.foss.demo/listView
			//eg: index.html#com.foss.demo/listView?t=push
			"*module/*page(?*param)": "modularRoute"
		},
		match: function(path, param) {
			Butterfly.log('route any: %s | %s', path, param);
		},
		index: function() {
			this.modularRoute(this.defaultModule, this.defaultView);
		},
		modularRoute: function(module, view, param) {
			Butterfly.log('route: module[%s] / view[%s] / params[%s]', module, view, param);
			
		}
	});

});