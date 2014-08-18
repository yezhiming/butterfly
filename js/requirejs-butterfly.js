define([], function () {
  'use strict';

	if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
	}

	//使用require.js加载View类
	var loadViewClass = function(require, ViewClassName, success, fail){
		// var viewLoaded = require.defined(ViewClassName);
		require(ViewClassName, function(){
			success.call(arguments);
		}, fail);
	}

  //获取绑定，以及绑定语法糖
  function getBinding(el, contextPath){
    var bindingName = el.getAttribute('data-window') || el.getAttribute('data-view');
    bindingName = bindingName != null ? bindingName : '$view';

    //patch for '$'
    bindingName = bindingName.replace('$', 'butterfly/')

    //patch for '.' and empty value
    bindingName = (bindingName == '.' || bindingName == '') ? contextPath.replace('.html', '') : bindingName;

    return bindingName;
  }

  //TODO: 如果该html页面页面有两个根节点，例如div.header div.content，则自动创建一个包裹div，并自动赋予id
	var loadViewClassByEL = function(require, view, htmlTemplate, success, fail){
		//只要body内的类容
    //TODO: 目前带上了body标签，改为只要里面的东西
		htmlTemplate = (/<html/i.test(htmlTemplate)) ? htmlTemplate.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0] : htmlTemplate;
		//转换成DOM
		var el = document.createElement('div');
		el.innerHTML = htmlTemplate;
		el = el.firstElementChild;

		//el的绑定类，若没有，默认为最普通的View（框架定义的）
		var elementBinding = getBinding(el, view);

    //el子节点的绑定类集合
		var el_view_bindings = el.querySelectorAll('[data-view]');
		var view_names = _.map(el_view_bindings, function(node){
			return getBinding(node, view);
		});
		view_names.unshift(elementBinding);

		//加载el以及el的子节点的所有绑定类
		require(view_names, function(){

			var TopViewClass = arguments[0];

      //when this proxy class initialize called, the html element will assign to el
			var ProxyViewClass = TopViewClass.extend({

				template: htmlTemplate,

				initialize: function(){

					//转换成DOM
					var el = document.createElement('div');
					el.innerHTML = this.template;
					el = el.firstElementChild;
					//replace element
					this.setElement(el);

					//apply binding
					var me = this;
					_.chain(this.el.querySelectorAll('[data-view]'))
					.foldl(function(mapping, node){
						var binding = node.getAttribute('data-view').replace('$', 'butterfly/');
						if (binding && binding.length > 0) mapping[binding] = node;
						return mapping;
					}, {})
					.each(function(node, bindingName){
						var ViewClass = require(bindingName);
						//TODO: inject parent
						var view = new ViewClass({el: node});
						me.addSubview(view);
					});

					TopViewClass.prototype.initialize.call(this, arguments);
				}
			});

			success(ProxyViewClass);

		}, fail);
	}

	var loadViewClass = function(require, view, success, fail){
		var me = this;
		console.log('loadView: %s', view);
		if (typeof view == 'string' && view.endsWith('html')) {

			require(['text!'+view], function(template){
				loadViewClassByEL(require, view, template, success, fail);
			}, fail);

		} else if (typeof view == 'string') {
			require([view], success, fail);

		} else {
			throw new Error('view loader plugin require a view name of string type');
		}
	}

  var plugin = {
  	load: function(name, req, onLoad, config){
  		loadViewClass(req, name, function(View){
  			onLoad(View);

  		}, function(err){
  			onLoad.error(err);

  		});
  	},

    //for non-amd usage
    loadViewClass: loadViewClass,

    //for non-amd usage
    loadView: function(success, fail){

      loadViewClass(require, name, function(View){

        var view = new View();
        success(view);
      }, fail);
    }
  }

  return plugin;
});
