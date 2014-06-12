define(['backbone'], function(Backbone){
	
	return Backbone.View.extend({

		initialize: function(options){
			this.subviews = [];
		},

		remove: function(){
			Backbone.View.prototype.remove.call(this);
			
			_.each(this.subviews, function(subview){
				subview.remove();
			});
		},

		addSubview: function(view){
			this.subviews.push(view);
		},

		setElement: function(element, delegate){
			Backbone.View.prototype.setElement.call(this, element, delegate);
		},
		
		

		render: function(){
			Backbone.View.prototype.render.call(this, arguments);
			return this;
		},

		/* show this view */
		show: function(){
			this.onShow();
		},
		/* hide this view */
		hide: function(){
			this.onHide();
		},

		//events
		onShow: function(){
			$(window).on('orientationchange', this.onOrientationchange);
      $(window).on('resize', this.onWindowResize);
      $(window).on('scroll', this.onWindowScroll);
		},
		onHide: function(){
			$(window).off('orientationchange', this.onOrientationchange);
      $(window).off('resize', this.onWindowResize);
      $(window).off('scroll', this.onWindowScroll);
		},

		onOrientationchange: function() {
        this.$('input').blur();
    },

		onWindowScroll: function() {},

    onWindowResize: function() {},

		route: function(){}
	});
});
