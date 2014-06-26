define([], function(){

	var EditingExtension = {
		
		//全选
		selectAllItems: function(){
			var allItems = this.el.querySelectorAll('ul li.row .selection');
			_.each(allItems, function(item){
				if (!$(item).hasClass('selected')) {item.classList.add('selected')};
			});
		},
		//全反选
		deselectAllItems: function(){
			var allItems = this.el.querySelectorAll('ul li.row .selection');
			_.each(allItems, function(item){
				if ($(item).hasClass('selected')) {item.classList.remove('selected')};
			});
		},
		//获取已选择的item
		selectedItems: function(){
			var me = this;
			var allItems = this.el.querySelectorAll('ul li.row');
			var selectedItems = _.filter(allItems, function(item){
				return $(item.querySelector('.selection')).hasClass('selected');
			});
			return _.map(selectedItems, function(item){
				return item.getAttribute('data-index');
			});
		},
		//删除选中的item
		deleteSelectedItems: function(){
			console.log('listview.deleteSelectedItems');
			this.deleteItems(this.selectedItems());
		}
	};

	return EditingExtension;
});