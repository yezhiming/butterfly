define(['require'], function(require){
	
	if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
	}

	// Butterfly.ViewLoader
  // ---------------
  //
	var ViewLoader = {

		//使用require.js加载View类
		loadViewClass: function(ViewClassName, success, fail){
			// var viewLoaded = require.defined(ViewClassName);
			require(ViewClassName, function(){
				success.call(arguments);
			}, fail);
		},

		//加载元素
		loadViewByEL : function(el, success, fail){
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
						if (success) success(topView);
					}, fail);
				}

			}, fail);

		},//loadViewByEL

		//TODO: 加多一个参数targetEl?
		//view can be either a html node or a string
		loadView : function(view, success, fail){
			var me = this;
			Butterfly.log('loadView: %s', view);
			if (typeof view == 'string' && view.endsWith('html')) {
				require(['text!'+view], function(page){

					var el = document.createElement('div');
					el.innerHTML = (/<html/i.test(page)) ? page.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0] : page;

					me.loadViewByEL(el.firstElementChild, success, fail);
				}, fail);

			} else if (typeof view == 'string') {
				require([view], function(View){
					success(new View());
				}, fail);

			} else {
				me.loadViewByEL(view ,success, fail);
			}
		}//loadView

	};

	return ViewLoader.loadView;
});