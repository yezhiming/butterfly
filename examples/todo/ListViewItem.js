define(['backbone'], function(Backbone){

	return Backbone.View.extend({

		tagName: "li",
		className: "table-view-cell",

		initialize: function(){
			Backbone.View.prototype.initialize.call(this, arguments);

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
				this.$el.addClass('selected');
			} else {
				this.$el.removeClass('selected');
			}
		},

		toggleSelect: function(){
			this.selected = !this.selected;
			this.$el.toggleClass('selected');
		}
	});
});
