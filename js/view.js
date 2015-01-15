define(['backbone'], function(Backbone){

	// Butterfly View
	// ==============

	var View =  Backbone.View.extend({

		//default event
		events: {
			"click a[data-action='back']": "goBack"
		},

		goBack: function(){
			window.history.back();
		},

		//add superview & subviews property
		constructor: function(options){
			if(options)this.superview = options.superview;
			this.subviews = [];

			Backbone.View.apply(this, arguments);
		},

		//remove superview & subviews reference
		remove: function(){
			Backbone.View.prototype.remove.call(this);

			this.superview = null;
			_.each(this.subviews, function(subview){
				subview.remove();
			});
		},

		//find a subview
		//Breadth First Search
		find: function(id){
			var result = _.find(this.subviews, function(subview){
				return subview.el.id == id;
			});

			if (!result) {
				var container = _.find(this.subviews, function(subview){
					return subview.find(id);
				});
				result = container.find(id);
			}

			return result;
		},

		addSubview: function(view){
			this.subviews.push(view);
		},

		/* show this view */
		show: function(options){
			this.onShow(options);
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

	return View;
});
