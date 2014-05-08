define(['require', './view'], function(require, View){
	
	if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
	}

	//使用require.js加载View类
	var loadViewClass = function(ViewClassName, success, fail){
		// var viewLoaded = require.defined(ViewClassName);
		require(ViewClassName, function(){
			success.call(arguments);
		}, fail);
	}

	//加载元素
	var loadViewByEL = function(el, success, fail){
		//el的绑定类，若没有，默认为最普通的View（框架定义的）
		var elementBinding = el.getAttribute('data-view') || './view';
		//加载el的绑定类
		require([elementBinding], function(TopViewClass){
			var topView = new TopViewClass({el: el});

			//el子节点的绑定类集合
			var el_view_bindings = el.querySelectorAll('[data-view]');
			var el_page_bindings = el.querySelectorAll('[data-page]');

			var view_names = _.map(el_view_bindings, function(node){ return node.getAttribute('data-view'); });
			var page_names = _.map(el_page_bindings, function(node){ return node.getAttribute('data-page'); });

			var task1 = (view_names.length > 0 ? 1 : 0) + (page_names.length > 0 ? 1 : 0);
			if (task1 == 0) {
				success(topView);
				return;
			}

			//TODO: load views
			require(view_names, function(){
				_.each(arguments, function(ViewClass, index){
					var view = new ViewClass({el: el_view_bindings[index]});
					topView.addSubview(view);
				});
				if(--task1 == 0) success(topView);
			}, fail);

			//TODO: load pages
			var task2 = page_names.length;
			_.each(page_names, function(page_name, index){
				loadView(page_name, function(view){
					el_page_bindings[index].appendChild(view.el);
					topView.addSubview(view);
					if (--task2 == 0) {
						if(--task1 == 0) success(topView);
					}
				}, fail);
			});
			
		}, fail);

	};

	//加多一个参数targetEl
	var loadView = function(view, success, fail){
		console.log('loadView: %s', view);
		if (typeof view == 'string') {
			require(['text!'+view], function(page){

				var el = document.createElement('div');
				el.innerHTML = (/<html/i.test(page)) ? page.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0] : page;

				loadViewByEL(el, success, fail);

			}, fail);
		} else {

			loadViewByEL(view ,success, fail);
		}
	}

	return {
		loadView: loadView
	}

});