/**
 * list view component
 * 下拉刷新实现方式：如检测到下拉控件，假设为40px，则滚动区top: -40px;
 */
define(['jquery', 'underscore', 'backbone', 'iscroll','./ListViewTemplateItem'], 
	function($, _, Backbone, IScroll, TItem) {

	var options = ['itemTemplate', 'itemClass', 'dataSource', 'pageSize'];

	var listview = Backbone.View.extend({
		events: {
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
		    tap: true
			});

			//隐藏pulldown
			if (this.el.querySelector('.pulldown')) {
				this.el.classList.add('withpulldown');
			};
			if (this.el.querySelector('.pullup')) {
				this.$('.scroller').css('margin-bottom', '-50px');
			}

			var $wrapper = $(me.IScroll.wrapper);
	    var $pullDown = this.$pullDown = this.$('.pulldown');
	    var $pullUp = this.$pullUp = this.$('.pullup');

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
				//if already flip
		    if ($pullDown.hasClass('flip')) {
		      me.onPullDown();
		    }
		    if ($pullUp.hasClass('flip')) {
		    //   $pullUp.removeClass('flip').addClass('loading').find('.label').html('加载中...');
		      me.onPullUp();
		    }
			});

		},//initialize

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

		//下拉的默认行为为重新加载数据
		//可以通过覆盖此方法，实现类似Twitter的加载更多旧数据
		onPullDown: function() {
			this.reloadData();
	  },
  
  	onPullUp: function() {
  		var me = this;

  		this.dataSource.loadData(this.page++, this.pageSize, function(result){

				//stop loading animate
	  		me.$pullUp.removeClass('flip loading').find('.label').html('上拉加载更多...');

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
	  },

	  _onLoadMore: function(event) {
	  	var me = this;
	  	var loadmoreButton = event.currentTarget;
	  	//show loading animate
	  	loadmoreButton.classList.add('loading');

			this.dataSource.loadData(this.page++, this.pageSize, function(result){

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

	/**
	 * Data Mantance
	 */
	_.extend(listview.prototype, {

		reloadData: function(){
			console.log('ListView.reloadData');
			var me = this;
			
			this.page = 0;

			this.el.classList.add('pulleddown');
      this.$pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');

	    this.dataSource.loadData(this.page++, this.pageSize, function(result){
				setTimeout(function(){

				//success callback
				me.el.classList.remove('pulleddown');
				me.$pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');

				//remove all
				me.deleteAllItems();
				//append items
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					me.addItem(item);
				});
				me.refresh();

				}, 200);
			}, function(error){
				//fail callback
				fail();
				me.refresh();
			});
		},

		addItem: function(item){
			this.subviews.push(item);
			this.el.querySelector("ul").appendChild(item.el);
		},

		//删除一个或多个item
		deleteItems: function(array, refresh){
			//invoke remove
			this.subviews = _.filter(this.subviews, function(each, index){
				if (array.indexOf(index) >= 0) each.remove();
				return array.indexOf(index) < 0;
			});
			if (refresh) this.refresh();
		},
		//删除所有item
		deleteAllItems: function(refresh){
			_.each(this.subviews, function(subview){
				subview.remove();
			});
			this.subviews = [];
			if (refresh) this.refresh();
		}

	});

	return listview;
});