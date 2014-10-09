define([
	'butterfly/view',
	'tasks'
	], function(View, Tasks){

	var template = _.template($('#cell-template').text());

	return View.extend({

		render: function(){
			console.log('todo index view render');

			var tasks = this.tasks = new Tasks();
			tasks.fetch({
				success: this.onLoad,
				error: this.onError
			});
		},

		onLoad: function(collection, response, options){
			console.log('on load');
			var cells_html = _.map(response, function(item){
				return template(item);
			})
			this.$('.table-view').append(cells_html);
		},

		onError: function(collection, response, options){
			console.log('on error');
		}

	});
});
