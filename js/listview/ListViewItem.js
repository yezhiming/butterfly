define(['../view'], function(View){
	
	return View.extend({

		tagName: "li",

		events: {
			"click": "onClick"
		},

		onClick: function(event){
			this.trigger('ListViewItem:click', this, event);
		},
		
		setEditing: function(editing){

		}
	});
});