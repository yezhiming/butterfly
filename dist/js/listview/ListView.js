/**
 * list view component
 * 下拉刷新实现方式：如检测到下拉控件，假设为40px，则滚动区top: -40px;
 */
define(['jquery', 'underscore', 'backbone', 'iscroll','./ListViewTemplateItem'], 
	function($, _, Backbone, IScroll, TItem) {

	var options = ['id', 'autoLoad' ,'itemTemplate', 'itemClass', 'dataSource', 'pageSize'];

	var listview = Backbone.View.extend({
		events: {
			"click .loadmore": "onLoadMore",
			"click li": "onRowSelect"
		},
		defaults: {
			autoLoad: true,
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
		    mouseWheel: true
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

			if (this.autoLoad){
				var state = this.loadState();
				if (state) {
					this.restoreData(state);
				} else {
					this.reloadData();
				}
			}

		},//initialize

		saveState: function(){
			var state = {
				y: this.IScroll.y,
				page: this.page
			}
			window.sessionStorage['ListView:' + this.id] = JSON.stringify(state);
		},

		loadState: function(){
			var state = window.sessionStorage['ListView:' + this.id];
			return state ? JSON.parse(state) : state;
		},

		//刷新
		refresh: function(){
			var me = this;
			setTimeout(function() {
				me.IScroll.refresh();
			}, 0);
		},

		//选择了某一行
		onRowSelect: function(event){
			var li = event.currentTarget;
			var liCollection = this.el.querySelector('ul').children;
			var index = _.indexOf(liCollection, li);
			var item = this.subviews[index];
			if (!this.editing) {
				this.trigger('itemSelect', this, item, index, event);
			} else {
				item.toggleSelect();
			}
		},

		//下拉的默认行为为重新加载数据
		//可以通过覆盖此方法，实现类似Twitter的加载更多旧数据
		onPullDown: function() {
			this.reloadData();
	  },
  
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
	  },

	  onLoadMore: function(event) {
	  	var me = this;
	  	var loadmoreButton = event.currentTarget;
	  	//show loading animate
	  	loadmoreButton.classList.add('loading');

			this.dataSource.loadData(this.page + 1, this.pageSize, function(result, finish){

				//increase current page number when success
				me.page++;

				//stop loading animate
	  		loadmoreButton.classList.remove('loading');


	  		if (finish) {
	  			loadmoreButton.classList.remove('visible');
	  		} else {
	  			loadmoreButton.classList.add('visible');
	  		}

	  		if (result && result.length > 0) {
					//append items
					result.forEach(function(data){
						var item = new me.itemClass({data: data});
						item.setEditing(me.editing);
						me.addItem(item);
					});
			 	} else {
			 		//show no data

			 	}
				me.refresh();


			}, function(error){
				//stop loading animate
				loadmoreButton.classList.remove('loading');
				me.refresh();

				alert('数据加载失败');
			});

	  }

	}, {
		//clear listview state by id, this API may be changed later
		clear: function(id){
			delete window.sessionStorage['ListView:' + id];
		}
	});

	/**
	 * Data Mantance
	 */
	_.extend(listview.prototype, {

		setEditing: function(editing){
			
			this.subviews.forEach(function(subview){
				subview.setEditing(editing);
			});

			this.editing = editing;
		},

		reset: function(){
			
			//删除所有cell
			this.deleteAllItems();
			
			//重置页码
			this.page = 0;

			//重置下拉刷新
			this.el.classList.add('pulleddown');
      this.$pullDown.removeClass('flip').addClass('loading').find('.label').html('加载中...');

      //reset loadmore button
      this.$('.loadmore').removeClass('visible');

      this.refresh();
		},

		reloadData: function(){
			console.log('ListView.reloadData');
			var me = this;
			
			this.reset();

      this.dataSource.clear();

	    this.dataSource.loadData(this.page, this.pageSize, function(result, finish){

				//success callback
				me.el.classList.remove('pulleddown');
				me.$pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');

				//loadmore
				if (!finish) me.$('.loadmore').addClass('visible');

				//remove all
				me.deleteAllItems();
				//append items
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					item.setEditing(me.editing);
					me.addItem(item);
				});
				me.refresh();

				me.trigger('load', me);

			}, function(error){

				//success callback
				me.el.classList.remove('pulleddown');
				me.$pullDown.removeClass('flip loading').find('.label').html('下拉刷新...');

				alert('数据加载失败');

				me.refresh();
			});
		},

		//从缓存中恢复数据
		restoreData: function(state){
			console.log('ListView.restoreData');
			var me = this;

			this.page = state.page;

			this.dataSource.loadData(0, (this.page + 1) * this.pageSize, function(result, finish){

				//loadmore
				if (!finish) me.$('.loadmore').addClass('visible');

				//remove all
				me.deleteAllItems();
				//append items
				result.forEach(function(data){
					var item = new me.itemClass({data: data});
					item.setEditing(me.editing);
					me.addItem(item);
				});
				me.refresh();

				me.IScroll.scrollTo(0, state.y);
				setTimeout(function(){
					me.trigger('load', me);
				},0)

			}, function(error){
				alert('数据加载失败');
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
		},

		selectedItems: function(){
			var me = this;
			return _.filter(this.subviews, function(item){
				return item.selected;
			});
		},

		selectedIndexes: function(){
			var items = this.subviews;
			return _.chain(items)
			.filter(function(item){
				return item.selected;
			})
			.map(function(item){
				return items.indexOf(item);
			})
			.value();
		}

	});

	return listview;
});
