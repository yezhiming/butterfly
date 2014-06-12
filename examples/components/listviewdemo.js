define([
	'butterfly/view', 
	'butterfly/listview/ListView', 
	'butterfly/listview/DataSource',
	'text!components/_listviewitem.html'], 
	function(View, ListView, DS, itemTemplateHTML){

	return View.extend({

		events: {
			"click #edit": "onEdit",
			"click #refresh": "onRefresh",
			"click #selectedItems": "onGetSelectedItems",
			"click #selectedIndexes": "onGetSelectedIndexes"
		},

		initialize: function(options){
			View.prototype.initialize.call(this, options);

			this.ds = new DS({
				identifier: 'demo-list',
				url: '../components/listviewdatasource.json',
				pageParam: 'pageIndex',
				requestParams: {
					IdentityToken: 'token123'
				}
			});

			this.listview = new ListView({
				el: this.el.querySelector('#demo-list'),
				itemTemplate: _.template(itemTemplateHTML),
				dataSource: this.ds
			});

			this.listenTo(this.listview, 'itemSelect', this.onItemSelect);
		},

		onEdit: function(){
			console.log('edit');
			this.listview.setEditing(!this.listview.editing);
		},

		onRefresh: function(){
			console.log('refresh');
			this.listview.reloadData();
		},

		onGetSelectedItems: function(){
			var selected = this.listview.selectedItems();
			alert(selected);
		},

		onGetSelectedIndexes: function(){
			var selected = this.listview.selectedIndexes();
			alert(selected);
		},

		onItemSelect: function(listview, item, index, event){
			console.log('itemSelect: %d', index);
		}
	});
});