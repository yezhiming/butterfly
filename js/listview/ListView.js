/**
 * list view component
 */
define(['jquery', 'underscore', 'backbone', 'iscroll','./ListViewTemplateItem'], 
	function($, _, Backbone, IScroll, TItem) {

	var options = ['itemTemplate', 'itemClass', 'dataSource', 'pageSize'];

	var listview = Backbone.View.extend({
		events: {
			"click .row": "_onRowTap",
			"click .loadmore": "_onLoadMore"
		},
		defaults: {
			editing: false,
			pageSize: 20
		},

		initialize: function() {
			var me = this;
			this.subviews = [];

			//grab params
			_.extend(this, this.defaults, _.pick(arguments[0], options));

			//convert itemTemplate to itemClass
			if (this.itemTemplate) {
				//this.itemTemplate already compiled
				this.itemClass = TItem.extend({template: this.itemTemplate});
			}

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
			_.each(this.subviews, function(subview){
				subview.remove();
			});
			if (refresh) this.refresh();
		},

		/*** public method ***/

		reloadData: function(){
			var me = this;
			
			this.deleteAllItems();

			// var $wrapper = $(me.IScroll.wrapper);
	    // var $pullDown = $wrapper.find('.pulldown');
	    // $wrapper.addClass('pulldownrefresh');
      // me.refresh();
	    // $pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');

			this.page = 0;
			this.dataSource.loadData(this.page, this.pageSize, function(result){
				// $wrapper.removeClass('pulldownrefresh');
				// $pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					me.addItem(item);
				});
				me.refresh();
			}, function(error){
				alert(error);
			});
		},

		addItem: function(item){
			this.subviews.push(item);
			this.el.querySelector("ul").appendChild(item.el);
		},
		
		//刷新
		refresh: function(){
			var me = this;
			setTimeout(function() {
				me.IScroll.refresh();
			}, 0);
		},

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
	  	//show loading animate
	  	loadmoreButton.classList.add('loading');

	  	this.dataSource.loadData(++this.page, this.pageSize, function(result){
	  		//stop loading animate
	  		loadmoreButton.classList.remove('loading');
	  		//append items
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					me.addItem(item);
				});
				me.refresh();
			}, function(error){
				//stop loading animate
				loadmoreButton.classList.remove('loading');
				me.refresh();
			});
	  }

	});

	return listview;
});