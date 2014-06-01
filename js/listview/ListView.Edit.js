define([], function(){

	var EditingExtension = {
		//开启/关闭编辑模式
		setEditing: function(editing) {
			this.editing = editing;
			if (editing) {
				this.$("ul li .selection").show();
			} else {
				this.deselectAllItems();
				this.$("ul li .selection").hide();
			}
		},
		
		//添加数据
		addItemElements: function(items, refresh){
			var me = this;
			var currentItemCount = this.itemCount();
			_.each(items, function(item){
				var li = document.createElement('li');
				li.classList.add('row');
				li.setAttribute('data-index', currentItemCount++);
				li.innerHTML = item;
				me.el.querySelector("ul").appendChild(li);
			});
			me.refresh();
		},
		//添加数据
		addItems: function(items, refresh){
			var me = this;
			var currentItemCount = this.itemCount();
			_.each(items, function(item){
				var li = document.createElement('li');
				li.classList.add('row');
				li.setAttribute('data-index', currentItemCount++);
				li.innerHTML = me.itemTemplate(item);
				me.el.querySelector("ul").appendChild(li);
			});
			me.refresh();
		},
		//item总数
		itemCount: function(){
			return this.el.querySelectorAll('ul li.row').length;
		},
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