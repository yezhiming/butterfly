define([
	'butterfly/view',
	'tasks'
	], function(View, Tasks){

	var template = _.template($('#cell-template').text());

	return View.extend({

		events: {
			"click #refresh": "onRefresh"
		},

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

			var listview = this.find('todo-list');
			this.listenTo(listview, 'loadmore', this.onLoadmore);

			this.tasks.fetchFirstPage();
		},

		onRefresh: function(){
			console.log('todo/index refresh');

			this.tasks.fetchFirstPage();
		},

		onLoadmore: function(){
			this.tasks.fetchNextPage();
		}

	});
});
