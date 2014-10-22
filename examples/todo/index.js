define([
	'butterfly/view',
	'tasks'
	], function(View, Tasks){

	var template = _.template($('#cell-template').text());

	return View.extend({

		initialize: function(){
			this.tasks = new Tasks();
		},

		render: function(){
			console.log('todo index view render');

			// this.tasks.fetch({
			// 	remove: false,
			// 	success: this.onLoad,
			// 	error: this.onError,
			// 	data: {page: 1, pageSize: 4}
			// });
		},

		reload: function(){
			tasks.fetch({
				remove: false,
				success: this.onLoad,
				error: this.onError,
				data: {page: 0, pageSize: 4}
			});
		},

		onLoad: function(collection, response, options){
			console.log('on load');
			var cells_html = _.map(collection.models, function(item){
				return template(item.toJSON());
			})
			this.$('.table-view').empty().append(cells_html);
		},

		onError: function(collection, response, options){
			console.log('on error');
		}

	});
});
