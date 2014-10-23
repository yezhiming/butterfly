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

		render: function(){
			Backbone.View.prototype.render.apply(this, arguments);
			return this;
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


	// View Animation Extentions
	// =========================

	var animations = ['slideInLeft', 'slideInRight', 'slideOutLeft', 'slideOutRight', 'slideInUp', 'slideInDown', 'slideOutUp', 'slideOutDown'];

	//animate
	var animationExtentions = {
		animate: function(name, onFinish){
			var me = this;

			this.$el.addClass('animated ' + name);
			this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				me.$el.removeClass('animated ' + name);
				if (onFinish) onFinish();
			});
		}
	}

	//transform animation name array to <name: fn> mapping json object
	animationExtentions = _.foldl(animations, function(memo, animation){
		memo['animate' + animation[0].charAt(0).toUpperCase() + animation.substring(1)] = function(onFinish){
			this.animate(animation, onFinish);
		}
		return memo;
	}, animationExtentions);

	//add to View prototype
	_.extend(View.prototype, animationExtentions);


	// View Modal Support
	// ==================
	_.extend(View.prototype, {

		doModal: function(){
			// TODO: reserved for shadow effect
			// this.mask = document.createElement('div');
			// this.mask.classList.add('butterfly-modal-mask');
			// document.body.appendChild(this.mask);

			this.$el.addClass('butterfly-modal');
			this.$el.appendTo(document.body);
			this.animateSlideInUp();
		},

		dismiss: function(){
			var me = this;
			this.animateSlideOutDown(function(){
				me.$el.removeClass('butterfly-modal');
				me.remove();
			});
		}
	});

	return View;
});
