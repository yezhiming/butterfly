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

		setActiveView: function(selector){
			this.$(">div").removeClass('active');
			var el = this.el.querySelector(selector);
			el.classList.add('active');
		}

	});
});