(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['exports', 'underscore', 'jquery', 'backbone'], function(exports, _, $, Backbone){
			root.Butterfly = factory(root, exports, _, $, Backbone);
		});

	} else {
		root.Butterfly = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$), Backbone);
	}

})(this, function(root, Butterfly, _, $, Backbone){

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

	//加载元素
	Butterfly.loadView = function(el, success, fail){
		//el的绑定类，若没有，默认为最普通的View（框架定义的）
		var elementBinding = (el.getAttribute('data-window') || el.getAttribute('data-view') || '$view').replace('$', 'butterfly/');
		//加载el的绑定类
		require([elementBinding], function(TopViewClass){
			var topView = new TopViewClass({el: el});

			//el子节点的绑定类集合
			var el_view_bindings = el.querySelectorAll('[data-view]');

			var view_names = _.map(el_view_bindings, function(node){
				return node.getAttribute('data-view').replace('$', 'butterfly/');
			});

			if (view_names.length == 0) {
				if (success) success(topView);

			} else {
				require(view_names, function(){
					_.each(arguments, function(ViewClass, index){
						var view = new ViewClass({el: el_view_bindings[index]});
						topView.addSubview(view);
					});
					topView.onLoad();
					if (success) success(topView);
				}, fail);
			}

		}, fail);

	}//loadView

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

	Butterfly.navigate = function(fragment, options){
		deprecated('please use window.butterfly.navigate() instead.');
		//default options
		options = options || {trigger: true};
		//default trigger
		options.trigger = (options.trigger == undefined) ? true : options.trigger;
		//pass params
		// this.router.routingOptions = options;
		Backbone.history.navigate(fragment, options);
	}

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
	    this.scanWindow(function(view){

	    	me.router = new Butterfly.Router();

	    	var pathname = window.location.pathname;
				var rootPath = pathname.substr(0, pathname.lastIndexOf('/'));
				Butterfly.log("start history with root: %s", rootPath);
				Backbone.history.start({pushState: false, root: rootPath});

				//invoke the window onShow
				view.render();
				view.show();

	    }, function(err){

				console.error("loadView:[%s] fail: %s", el, err);
				throw err;
			});
		},

		scanWindow: function(success, fail){
			var me = this;

			var mainWindow = document.querySelector('[data-window]');
			if (!mainWindow) {
				throw new Error('window not found');
			}

			Butterfly.loadView(mainWindow, function(view){

				me.window = view;
				success(view);

			}, fail);
		}

	});

	Butterfly.ready = function(callback){
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback()
    else document.addEventListener('DOMContentLoaded', function(){ callback() }, false)
    return this;
  }

	Butterfly.ready(function(){
		var app = new Butterfly.Application(document.body);
		root.butterfly = app;
		app.fly();
	});

	return Butterfly;
});
