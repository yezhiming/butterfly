define([
	'butterfly/view', 
	'butterfly/listview/ListView', 
	'butterfly/listview/DataSource',
	'text!components/_listviewitem.html'], 
	function(View, ListView, DS, itemTemplateHTML){

	return View.extend({

		events: {
			"click #action": "action"
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

			this.listview.reloadData();
		},

		action: function(){
			console.log('action');
			// this.listview.deleteItems([1,2,3], true);
			this.listview.reloadData();
		}
	});
});