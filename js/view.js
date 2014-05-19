define(['backbone'], function(Backbone){
	
	return Backbone.View.extend({

		initialize: function(options){
			this.subviews = [];
			this.el.view = this;

			if (this.el.hasAttribute('data-key-window')) {
				
			};
		},

		addSubview: function(view){
			this.subviews.push(view);
		},

		setElement: function(element, delegate){
			Backbone.View.prototype.setElement.call(this, element, delegate);
		},
		
		remove: function(){
			delete this.el.view;
			Backbone.View.prototype.remove.call(this);
			_.each(this.subviews, function(subview){
				subview.remove();
			});
		},

		render: function(){
			Backbone.View.prototype.render.call(this, arguments);
		},

		navigate: function(){},

		show: function(){},
		hide: function(){},
		
		saveState: function(){},
		loadState: function(){}

	});
});