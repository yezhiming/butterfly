define(['../view'], function(View){
	
	return View.extend({

		tagName: "li",

		initialize: function(){
			View.prototype.initialize.call(this, arguments);

			this.$el.append('<div class="selection"><span></span></div>');
			this.$el.append('<div class="content"></div>');
			this.$el.append('<div class="controls"></div>');
		},

		setContent: function(content){
			this.$('.content').append(content);

			return this;
		},
		
		setEditing: function(editing){
			if (editing) {
				this.$el.addClass('editing');
			} else {
				this.$el.removeClass('editing');
			}
		},

		toggleSelect: function(){
			this.$('.selection').toggleClass('selected');
		}
	});
});