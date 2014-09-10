define([], function () {
  'use strict';

	if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
	}

  //获取el的绑定，以及绑定语法糖的逻辑
  function getBinding(el, contextPath){
    var bindingName = el.getAttribute('data-window') || el.getAttribute('data-view');
    bindingName = bindingName != null ? bindingName : '$view';

    //patch for '$'
    bindingName = bindingName.replace('$', 'butterfly/')

    //patch for '.' and empty value
    //如果写data-view，但无值，则默认使用与此html同名的js文件，例如member/login.html，则使用member/login.js
    //当然，需要提供contextPath，这个patch才有效
    if (contextPath){
      bindingName = (bindingName == '.' || bindingName == '') ? contextPath.replace('.html', '') : bindingName;
    }

    return bindingName;
  }

  //获取el及其子节点的绑定
  function getBindingAll(el, contextPath){

    //el的绑定类，若没有，默认为最普通的View（框架定义的）
    var elementBinding = getBinding(el, contextPath);

    //el子节点的绑定类集合
    var el_view_bindings = el.querySelectorAll('[data-view]');
    var view_names = _.map(el_view_bindings, function(node){
      return getBinding(node);
    });
    view_names.unshift(elementBinding);

    return view_names;
  }

  var createProxyViewClass = function(ViewClass, el, htmlTemplate){

    return ViewClass.extend({

      _targetElement: el,

      _template: htmlTemplate,

      constructor: function(){

        if (this._targetElement) {
          this.el = this._targetElement;

        } else {

          //转换成DOM
          var el = document.createElement('div');
          el.innerHTML = this._template;
          el = el.childElementCount == 1 ? el.firstElementChild : el;

          this.el = el;
        }

        ViewClass.apply(this, arguments);

        this.applyBinding();
      },

      applyBinding: function(){
        //apply binding
        var me = this;
        _.chain(_.result(this, 'el').querySelectorAll('[data-view]'))
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
      }
    });
  }

  //TODO: 如果该html页面页面有两个根节点，例如div.header div.content，则自动创建一个包裹div，并自动赋予id
	var loadViewClassByEL = function(require, view, htmlTemplate, success, fail){
		//只要body内的类容
    //TODO: 目前带上了body标签，改为只要里面的东西
		htmlTemplate = (/<html/i.test(htmlTemplate)) ? htmlTemplate.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0] : htmlTemplate;
		//转换成DOM
		var el = document.createElement('div');
		el.innerHTML = htmlTemplate;
		el = el.childElementCount == 1 ? el.firstElementChild : el;

		//加载el以及el的子节点的所有绑定类
		require(getBindingAll(el, view), function(){

			var TopViewClass = arguments[0];

      //由于require.js的加载机制，如果有两个地方用到这个View，那么其实是同一个实例，el也是同一个，所以会互相影响
      //这里采取的方法是，只保存htmlTemplate，以字符串形式，在View创建实例时，才转化成DOM对象
      //when this proxy class initialize called, the html element will assign to el
			var ProxyViewClass = createProxyViewClass(TopViewClass, null, htmlTemplate);

			success(ProxyViewClass);

		}, fail);
	}

	var loadViewClass = function(require, view, success, fail){

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

    //for non-AMD usage
    getBinding: getBinding,

    loadView: function(el, success, fail){

      //加载el以及el的子节点的所有绑定类
      require(getBindingAll(el), function(){

        var TopViewClass = arguments[0];

        var ProxyViewClass = createProxyViewClass(TopViewClass, el);

        success(ProxyViewClass);

      }, fail);
    }
  }

  return plugin;
});
