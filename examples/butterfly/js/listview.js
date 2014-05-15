define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {

	var options = ['itemTemplate'];

	/**
	 * list view component
	 */
	var listview = Backbone.View.extend({
		events: {
			"click .row": "_onRowTap",
			"click .loadmore": "_onLoadMore"
		},
		defaults: {
			editing: false
		},

		/*** public method ***/
		
		setEditing: function(editing) {
			this.editing = editing;
			if (editing) {
				this.$("ul li .selection").show();
			} else {
				this.deselectAllItems();
				this.$("ul li .selection").hide();
			}
		},

		// 加载数据
		load: function(){
			var me = this;
			// var $wrapper = $(me.IScroll.wrapper);
	    // var $pullDown = $wrapper.find('.pulldown');
	    // $wrapper.addClass('pulldownrefresh');
      // me.refresh();
	    // $pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');
	    this.deleteAllItems(false);
			this.trigger('load', this, function(){
				// $wrapper.removeClass('pulldownrefresh');
				// $pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');
				me.refresh();
			});
		},
		
		//刷新
		refresh: function(){
			var me = this;
			setTimeout(function() {
				me.IScroll.refresh();
			}, 0);
		},

		initialize: function() {

			var me = this;

			//grab params
			_.extend(this, this.defaults, _.pick(arguments[0], options));

			me.IScroll = new IScroll(this.el, {
				probeType: 2,
				scrollX: false,
		    scrollY: true,
		    mouseWheel: true,
		    click: false
			});

			var $wrapper = $(me.IScroll.wrapper);
	    var $pullDown = $wrapper.find('.pulldown');
	    var $pullUp = $wrapper.find('.pullup');

			me.IScroll.on('scroll', function() {
				console.log('scroll');
		    if (this.y > 60) {
		      $pullDown.addClass('flip').find('.label').html('释放更新');
		    } else if(this.y < 60 && this.y > 0) {
		      $pullDown.removeClass('flip').find('.label').html('下拉刷新');
		    }
		    // if (this.maxScrollY - this.y > 60) {
		    //   $pullUp.addClass('flip').find('.label').html('释放加载更多...');
		    // } else {
		    //   $pullUp.removeClass('flip').find('.label').html('上拉加载更多...');
		    // }
			});

			me.IScroll.on('scrollEnd', function() {

		    if ($pullDown.hasClass('flip')) {
		      $wrapper.addClass('pulldownrefresh');
		      $pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');
		      me.refresh();//this is IScroll
		      me._onPullDown($wrapper);
		    }
		    // if ($pullUp.hasClass('flip')) {
		    //   $pullUp.removeClass('flip').addClass('loading').find('.label').html('加载中...');
		    //   me._onPullUp($wrapper);
		    // }
			});

		},//initialize

		_onRowTap: function(event){
			var index = event.currentTarget.getAttribute('data-index');
			if (!this.editing) {
				this.trigger('itemSelect', this, index, event);
			} else {
				$(event.currentTarget.querySelector('.selection')).toggleClass('selected');
			}
		},

		_onPullDown: function($wrapper) {
			var me = this;
			//触发下拉事件，参数：[ListView, finishCallback]
			this.trigger('pulldown', this, function(){
				var $pullDown = $wrapper.find('.pulldown');
				$wrapper.removeClass('pulldownrefresh');
	      // $pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');
	      me.refresh();
			});
	  },
  
  	_onPullUp: function($wrapper) {
  		var me = this;
  		//触发上拉事件，参数：[ListView, finishCallback]
  		this.trigger('pullup', this, function(){
  			var $pullUp = $wrapper.find('.pullup');
  			$pullUp.removeClass('flip loading').find('.label').html('上拉加载更多...');
	      me.refresh();
  		});
	  },

	  _onLoadMore: function(event) {
	  	var me = this;
	  	var loadmoreButton = event.currentTarget;
	  	loadmoreButton.classList.add('loading');
	  	this.trigger('pullup', this, function(){
	  		loadmoreButton.classList.remove('loading');
	  		me.refresh();
	  	});
	  }

	});

	/**
	 * 编辑列表
	 */
	_.extend(listview.prototype, {
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
		},
		//删除一个或多个item
		deleteItems: function(array){
			var ul = this.el.querySelector('ul');
			_.each(ul.querySelectorAll('li'), function(li){
				var index = li.getAttribute('data-index');
				if (_.contains(array, index)) ul.removeChild(li);
			});
			this.refresh();
		},
		//删除所有item
		deleteAllItems: function(refresh){
			var ul = this.el.querySelector('ul');
			while (ul.lastChild) {
				ul.removeChild(ul.lastChild);
			}
			if (refresh) this.refresh();
		}
	});

	return listview;
});