define(['butterfly', 'butterfly/view', 'backbone'], function(Butterfly, View, Backbone){

	/**
	 * TODO:
	 * 1. 容器内增加loading，在页面切换时显示
	 */
	return View.extend({

		initialize: function(options){
			View.prototype.initialize.call(this, options);

			this.el.classList.add('container');
			var routes = this.el.getAttribute('data-routes');

			//todo: register router
			Butterfly.router.on('route', function(path, params){
				console.log('route event: %s | %s', path, params);
				
			});

			var MR = Backbone.Router.extend({
				routes: {
					"ccc": "route1"
				},
				route1: function(){
					console.log('route1');
				}
			});

			var mr = new MR();
			mr.remove();
		},

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
		}

	});
});