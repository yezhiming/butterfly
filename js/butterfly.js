(function(){
	'use strict';

	//window
	var root = this;
	
	var Butterfly = {
		//constants
		VERSION: '1.0',
		PREFIX: 'bt',

		//globals
		components: {}
	};

	//attache to root
	root.Butterfly = Butterfly;

	Butterfly.ready = function(callback){
    // need to check if document.body exists for IE as that browser reports
    // document ready when it hasn't yet created the body element
    if (/complete|loaded|interactive/.test(document.readyState) && document.body) callback()
    else document.addEventListener('DOMContentLoaded', function(){ callback() }, false)
    return this;
  }

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

	//define a plugin
	Butterfly.define = function(name, component){
		Butterfly.log('define component: %s', name);
		this.components[name] = component;

		//TODO: apply unbind bindings
		if (Butterfly.application)
		Butterfly.application.applyBindings();
		//TODO: replace binding?
	};

	Butterfly.bind = function(name, object){

	};

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
			Butterfly.log('build view structure...');
			this.scan(this.el);
			Butterfly.log('apply bindings...');
			this.applyBindings();
		},

		//扫描结构
		scan: function(el){
			//针对el进行分析，只有两种可能，自身是view，或子孙是
			//先检查自身，若自身el已经是view，则构建view，并跳过子节点的检查（让view去处理）
			if (el.getAttribute(Butterfly.PREFIX + '-view')) {
				
				var topview = new Butterfly.ViewBinding(el);
				this.topViews.push(topview);
			} else {
				//递归检查子节点
				for (var i = 0, node; node = el.childNodes[i]; i++)
	      {
	      	if (node.nodeType === 1) this.scan(node);
	      }
			}
			//
		},

		applyBindings: function(){
			var me = this;
			_.each(Butterfly.components, function(component_factory, name){
				Butterfly.log('bind component:' + name);
				_.each(me.topViews, function(binding){
					if (binding.componentName === name)
						me.bindComponent(binding, name, component_factory);
				});
			});
		},

		//apply binding
		bindComponent: function(binding, name, factory){
			var me = this;

			//create new view
			var view = new View(binding.el);
			factory(view);
			//
			view.delegateEvents();


			// component.bind(binding.el);

			//subviews
			if (binding.subviews && binding.subviews.length > 0) {
				_.each(binding.subviews, function(subview){
					me.bindComponent(binding, name, component);
				});
			};
		}

	});

	// Butterfly.ViewBinding
	// 描述标签绑定，以及层级结构
	//

	_.templateSettings = {
	  interpolate: /\{\{(.+?)\}\}/g
	};

	var ViewBinding = Butterfly.ViewBinding = function(el, parent){
		Butterfly.log('create binding: ' + el.getAttribute('id'));

		this.el = el;
		this.componentName = el.getAttribute(Butterfly.PREFIX + '-view');
		this.bindings = [];
		this.children = [];
		this._scan(el);
	};

	_.extend(ViewBinding.prototype, {

		_scan: function(el){
			for (var i = 0, node; node = el.childNodes[i]; i++) {
				if (node.nodeType === 1) {
	      	this._scanElement(node, this);
	      }
			}
		},

		_scanElement: function(el, parent){
			if (el.getAttribute(Butterfly.PREFIX + '-view')) {

				var view = new Butterfly.ViewBinding(el);
				parent.children.push(view);
			} else {
				for (var i = 0, node; node = el.childNodes[i]; i++) {
		      if (node.nodeType === 1) {
		      	this._scanElement(node, this);
		      } else if (node.nodeType === 3) {
		        this._scanText(node); //扫描文本节点
		      }
		  	}
	  	}
		},
		
		_scanText: function(node){
			//extrat
			var match = node.textContent.match(/{{\w+}}/g);
			if (match) {
				var variables = [];
				for (var i = 0; i < match.length; i++) {
					var variable = match[i].substr(2, match[i].length -4);
					variables.push(variable);
				};
				this._createBinding(node, variables);
				// console.log(match + ' got text with:' + this.el.id);
			};
		},

		_createBinding: function(node, variables){
			Butterfly.log('create text binding');
			var binding = {node: node, template: _.template(node.textContent)};
			this.bindings.push(binding);
		}
	});

	//
	var View = Butterfly.View = function(el){
		this.cid = _.uniqueId('view');
		this.el = el;
		this.$el = $(el);
		this._events = {};
	};

	_.extend(View.prototype, {

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(/^(\S+)\s*(.*)$/);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    }
	});

	// delegate events when events property assigned, using setter 
	//
	// Object.defineProperty(View.prototype, 'events', {
	// 	get: function(){
	// 		return this._events;
	// 	},
	// 	set: function(value){
	// 		this.undelegateEvents();
	// 		this._events = value;
	// 		this.delegateEvents();
	// 	}
	// });

	Butterfly.ready(function(){
		Butterfly.application = new Butterfly.Application(document.body);
		Butterfly.application.fly();
	});

}).call(this);
