define([
	'butterfly/view',
	'tasks'
	], function(View, Tasks){

	var template = _.template($('#cell-template').text());

	return View.extend({

		events: {
			"click #refresh": "onRefresh",
			"click #edit": "onEdit"
		},

		initialize: function(){
			this.tasks = new Tasks();
		},

		render: function(){
			console.log('todo index view render');

			var listview = this.find('todo-list');
			this.listenTo(listview, 'loadmore', this.onLoadmore);
			this.listenTo(listview, 'itemSelect', this.onItemSelect);

			this.tasks.fetchFirstPage();
		},

		onItemSelect: function(listview, item, index, event){
			var modelToRemove = this.tasks.at(index);
			modelToRemove.destroy();
		},

		onRefresh: function(){
			console.log('todo/index refresh');

			this.tasks.fetchFirstPage();
		},

		onEdit: function(){
			var listview = this.find('todo-list');
			listview.setEditing(!listview.editing);
		},

		onLoadmore: function(){
			this.tasks.fetchNextPage();
		}

	});
});
