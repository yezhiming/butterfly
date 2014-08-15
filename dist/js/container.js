define(['butterfly', 'butterfly/view'], function(Butterfly, View){

	/**
	 * TODO:
	 * 1. 容器内增加loading，在页面切换时显示
	 */
	return View.extend({

		initialize: function(options){
			View.prototype.initialize.call(this, options);

			//add routes support
			this.routes = {};

			//parse data-routes attribute into routes
			var routesAttr = this.el.getAttribute('data-routes');
			if (routesAttr) {
				_.chain(routesAttr.replace(/[\n\t\s]/g, '').split(','))
				.map(function(each){
					return each.split(':');
				})
				.foldl(function(routes, pair){
					routes[pair[0]] = pair[1];
					return routes;
				}, this.routes);
			};
		},

		addSubview: function(view){
			View.prototype.addSubview.call(this, view);

			// add route support
			var path = view.el.getAttribute('data-route') || view.el.id;
			if (path) this.routes[path] = view;
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
			var targetRoute = array.shift();
			var subview = this.routes[targetRoute];

			if (subview) {
				this.contentView = subview;
				this.subviews.forEach(function(subview){
					subview.el.classList.remove('active');
					subview.hide();
				});
				subview.el.classList.add('active');
				subview.show();

				if (array.length > 0) subview.route(array.join('/'));
			}
		}

	});
});
