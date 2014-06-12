define(['../view'], function(View){
	
	return View.extend({

		tagName: "li",

		initialize: function(){
			View.prototype.initialize.call(this, arguments);

			this.$el.append('<div class="selection"><span></span></div>');
			this.$el.append('<div class="item-content"></div>');
			this.$el.append('<div class="controls"></div>');
		},

		setContent: function(content){
			this.$('.item-content').append(content);

			return this;
		},
		
		setEditing: function(editing){
			if (editing) {
				this.$el.addClass('editing');
			} else {
				this.$el.removeClass('editing');
			}
		},

		setSelected: function(selected){
			this.selected = selected;
			if (this.selected) {
				this.$('.selection').addClass('selected');
			} else {
				this.$('.selection').removeClass('selected');
			}
		},

		toggleSelect: function(){
			this.selected = !this.selected;
			this.$('.selection').toggleClass('selected');
		}
	});
});