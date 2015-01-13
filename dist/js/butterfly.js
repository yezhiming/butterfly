(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['exports', 'underscore', 'jquery', 'backbone', 'view'], function(exports, _, $, Backbone, ViewPlugin){
			root.Butterfly = factory(root, exports, _, $, Backbone, ViewPlugin);
		});

	} else {
		root.Butterfly = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$), Backbone);
	}

})(this, function(root, Butterfly, _, $, Backbone, ViewPlugin){

	// Plugin System
	// ---------------

	// use a plugin in all view instances
	Backbone.View.use = function(Plugin) {
		_.extend(this.prototype, Plugin);
		return this;
	}

	// use plugin in this view instance
	Backbone.View.prototype.use = function(Plugin) {
		_.extend(this, Plugin);
		return this;
	}

	//Butterfly start
	Butterfly.VERSION = '1.0';

  // Butterfly.Router
  // ---------------
  //
  var Router = Butterfly.Router = Backbone.Router.extend({
		routes: {
			'*path(?*queryString)': 'any',
		},
		any: function(path, queryString){
			console.log('route: %s ? %s', path, queryString);

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
			if (this.rootView.route) this.rootView.route(path, options);
		},

		//launch application
		fly: function(){

			var me = this;
	    this.scanRootView(function(view){

				me.rootView = view;

	    	me.router = new Butterfly.Router();

	    	var pathname = window.location.pathname;
				var rootPath = pathname.substr(0, pathname.lastIndexOf('/'));
				console.log("start history with root: [%s]", rootPath);
				Backbone.history.start({pushState: false, root: rootPath});

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

				success(view);

			}, fail);
		}

	});

	$(function(){
		root.butterfly = new Butterfly.Application(document.body).fly();
	});

	return Butterfly;
});
