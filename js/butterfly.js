(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['exports', 'underscore', 'jquery', 'backbone', 'view'], function(exports, _, $, Backbone, ViewPlugin){
			root.Butterfly = factory(root, exports, _, $, Backbone, ViewPlugin);
		});

	} else {
		root.Butterfly = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$), Backbone);
	}

})(this, function(root, Butterfly, _, $, Backbone, ViewPlugin){

	String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };

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

	//print deprecated info
	var deprecated = function(message){
		console.log('%c deprecated: %s', 'background: #222; color: #bada55', message);
	}

	//Butterfly start
	Butterfly.VERSION = '1.0';

  Butterfly.log = function(){
  	arguments[0] = new Date().format('h:mm:ss:S') + '[><] ' + arguments[0];
  	console.log.apply(console, arguments);
  }

  // Butterfly.Router
  // ---------------
  //
  var Router = Butterfly.Router = Backbone.Router.extend({
		routes: {
			'*path(?*queryString)': 'any',
		},
		any: function(path, queryString){
			Butterfly.log('route: %s ? %s', path, queryString);

			if (this.routingOptions) this.routingOptions['queryString'] = queryString;
			root.butterfly.route(path, this.routingOptions);
			delete this.routingOptions;
		}
	});

  Butterfly.history = Backbone.history;

  // Butterfly.Application
  // ---------------
  //
	var Application = Butterfly.Application = function(el){
		this.el = el;
	};

	_.extend(Application.prototype, {

		navigate: function(fragment, options){
			//default options
			options = options || {trigger: true};
			//default trigger
			options.trigger = (options.trigger == undefined) ? true : options.trigger;
			//pass params
			this.router.routingOptions = options;
			Backbone.history.navigate(fragment, options);
		},

		route: function(path, options){
			if (this.window.route) this.window.route(path, options);
		},

		//launch application
		fly: function(){

			var me = this;
	    this.scanRootView(function(view){

	    	me.router = new Butterfly.Router();

	    	var pathname = window.location.pathname;
				var rootPath = pathname.substr(0, pathname.lastIndexOf('/'));
				Butterfly.log("start history with root: %s", rootPath);
				Backbone.history.start({pushState: false, root: rootPath});

				//invoke the window onShow
				view.render();
				view.show();

	    }, function(err){

				console.error("fail to load root view: %s", err);
				throw err;
			});

			return this;
		},

		scanRootView: function(success, fail){
			var me = this;

			var rootView = this.el.querySelector('[data-view]');
			if (!rootView) {
				throw new Error('root view not found');
			}

			ViewPlugin.loadView(rootView, function(View){

				var view = new View();

				me.window = view;
				success(view);

			}, fail);
		}

	});

	$(function(){
		root.butterfly = new Butterfly.Application(document.body).fly();
	});

	return Butterfly;
});
