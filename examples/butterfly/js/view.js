define(['backbone'], function(Backbone){
	
	return Backbone.View.extend({

		initialize: function(){
			this.subviews = [];
		},

		addSubview: function(view){
			// console.log('add [%s] to [%s]', view.el.id, this.el.id);
			this.subviews.push(view);
		},

		setElement: function(element, delegate){
			Backbone.View.prototype.setElement.call(this, element, delegate);
		},
		
		remove: function(){
			console.log('remove: ' + this.el.id);
			_.each(this.subviews, function(subview){
				subview.remove();
			});
		},

		show: function(){},
		hide: function(){}

	});
});