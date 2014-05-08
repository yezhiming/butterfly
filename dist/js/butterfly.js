(function(root, factory) {

	if (typeof define === 'function' && define.amd) {

		define(['underscore', 'jquery', 'backbone', 'exports'], 
			function(_, $, Backbone, exports){

			root.Butterfly = factory(root, exports, _, $, Backbone);
		});

	} else {
		root.Butterfly = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
	}

})(this, function(root, Butterfly, _, $, Backbone){

	Butterfly.VERSION = '1.0';
	Butterfly.history = Backbone.history;

	Date.prototype.format = function(format) //author: meizz
	{
	  var o = {
	    "M+" : this.getMonth()+1, //month
	    "d+" : this.getDate(),    //day
	    "h+" : this.getHours(),   //hour
	    "m+" : this.getMinutes(), //minute
	    "s+" : this.getSeconds(), //second
	    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	    "S" : this.getMilliseconds() //millisecond
	  }

	  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	  for(var k in o)if(new RegExp("("+ k +")").test(format))
	    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	  return format;
	}

  Butterfly.log = function(){
  	arguments[0] = new Date().format('h:mm:ss:S') + '[Butterfly] ' + arguments[0];
  	console.log.apply(console, arguments);
  }

  Butterfly.Router = Backbone.Router.extend({
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

	//the Butterfly
	var Application = Butterfly.Application = function(el){

		this.el = el;
		this.topViews = [];
	};

	_.extend(Application.prototype, {
	
		//launch!
		//load components
		//scan dom
		fly: function(){

			var router = new Butterfly.Router();
			Butterfly.router = router;

			var rootPath = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
			Butterfly.log("start history with root: %s", rootPath);
			Backbone.history.start({
	      pushState: false,
	      root: rootPath
	    });
		}

	});

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g
	};

	Butterfly.navigate = function(fragment, options){
		options = options || {trigger: true};
		Backbone.history.navigate(fragment, options);
	}

	Butterfly.ready = function(callback){
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback()
    else document.addEventListener('DOMContentLoaded', function(){ callback() }, false)
    return this;
  }

	Butterfly.ready(function(){
		var app = new Butterfly.Application(document.body);
		//only one now
		Butterfly.application = app;
		app.fly();
	});

	return Butterfly;
});

// (function(){
// 	'use strict';

// 	//window
// 	var root = this;
	
// 	var Butterfly = {
// 		//constants
// 		VERSION: '1.0',
// 		PREFIX: 'data'
// 	};

// 	//attache to root
// 	root.Butterfly = Butterfly;

//   Date.prototype.format = function(format) //author: meizz
// 	{
// 	  var o = {
// 	    "M+" : this.getMonth()+1, //month
// 	    "d+" : this.getDate(),    //day
// 	    "h+" : this.getHours(),   //hour
// 	    "m+" : this.getMinutes(), //minute
// 	    "s+" : this.getSeconds(), //second
// 	    "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
// 	    "S" : this.getMilliseconds() //millisecond
// 	  }

// 	  if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
// 	  for(var k in o)if(new RegExp("("+ k +")").test(format))
// 	    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
// 	  return format;
// 	}

//   Butterfly.log = function(){
//   	arguments[0] = new Date().format('h:mm:ss:S') + '[Butterfly] ' + arguments[0];
//   	console.log.apply(console, arguments);
//   }

//   Butterfly.history = Backbone.history;

// 	Butterfly.Router = Backbone.Router.extend({
// 		routes: {
// 			'*path(?*param)': 'match',
// 			//eg: index.html
// 			'': 'index',
// 			//eg: index.html#com.foss.demo/listView
// 			//eg: index.html#com.foss.demo/listView?t=push
// 			"*module/*page(?*param)": "modularRoute"
// 		},
// 		match: function(path, param) {
// 			Butterfly.log('route any: %s | %s', path, param);
// 		},
// 		index: function() {
// 			this.modularRoute(this.defaultModule, this.defaultView);
// 		},
// 		modularRoute: function(module, view, param) {
// 			Butterfly.log('route: module[%s] / view[%s] / params[%s]', module, view, param);
			
// 		}
// 	});

// 	//the Butterfly
// 	var Application = Butterfly.Application = function(el){

// 		this.el = el;
// 		this.topViews = [];
// 	};

// 	_.extend(Application.prototype, {
	
// 		//launch!
// 		//load components
// 		//scan dom
// 		fly: function(){

// 			var router = new Butterfly.Router();
// 			Butterfly.router = router;

// 			var rootPath = window.location.pathname.substr(0, window.location.pathname.lastIndexOf('/'));
// 			Butterfly.log("start history with root: %s", rootPath);
// 			Backbone.history.start({
// 	      pushState: false,
// 	      root: rootPath
// 	    });
// 		}

// 	});

// 	_.templateSettings = {
// 	  interpolate: /\{\{(.+?)\}\}/g
// 	};

// 	Butterfly.navigate = function(fragment, options){
// 		options = options || {trigger: true};
// 		Backbone.history.navigate(fragment, options);
// 	}

// 	Butterfly.ready = function(callback){
//     if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback()
//     else document.addEventListener('DOMContentLoaded', function(){ callback() }, false)
//     return this;
//   }

// 	Butterfly.ready(function(){
// 		var app = new Butterfly.Application(document.body);
// 		//only one now
// 		Butterfly.application = app;
// 		app.fly();
// 	});

// }).call(this);