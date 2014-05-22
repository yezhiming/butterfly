define(['butterfly', 'butterfly/view', 'backbone'], function(Butterfly, View, Backbone){

	/**
	 * TODO:
	 * 1. 容器内增加loading，在页面切换时显示
	 */
	return View.extend({

		initialize: function(options){
			View.prototype.initialize.call(this, options);

			// this.el.classList.add('container');
		},

		/*单个*/
		setContentView: function(view){
			var me = this;

			Butterfly.ViewLoader.loadView(view, function(viewObject){
				if (me.contentView) {
					me.contentView.hide();
					me.contentView.remove();
				};
				me.contentView = viewObject;
				me.el.appendChild(viewObject.el);
				viewObject.show();
			});
		},

		//目前是取path的第一节作为id，找到相应的子节点，隐藏其他，显示出来
		route: function(paths, params){
			
			if (!paths) return;

			var array = paths.split('/');
			var subview = this.routes[array.shift()];

			if (subview) {
				this.subviews.forEach(function(subview){
					subview.el.classList.remove('active');
				});
				subview.el.classList.add('active');

				if (array.length > 0) subview.route(array.join('/'));
			}
		}

	});
});