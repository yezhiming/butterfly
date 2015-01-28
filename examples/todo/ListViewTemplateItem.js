define(['./ListViewItem'], function(ListViewItem){
	
	return ListViewItem.extend({

		initialize: function(options){
			ListViewItem.prototype.initialize.call(this, options);
			//render the template into HTML, append to self
			// this.el.innerHTML = this.template(options.data);

			this.setContent(this.template(options.data));
		}
	});
});