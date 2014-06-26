define([], function(){

	var Ex = {
		//点击加载更多
  	onPullUp: function() {
  		var me = this;

  		this.dataSource.loadData(this.page++, this.pageSize, function(result){

				//stop loading animate
	  		me.$pullUp.removeClass('flip loading').find('.label').html('上拉加载更多...');

				//append items
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					item.setEditing(me.editing);
					me.addItem(item);
				});
				me.refresh();

			}, function(error){
				//stop loading animate
				loadmoreButton.classList.remove('loading');
				me.refresh();

				alert('数据加载失败');
			});
	  }
	}

	return Ex;
});