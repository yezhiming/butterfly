define(['underscore', 'jquery', 'backbone'], function(_, $, Backbone){

	var dsOptions = ['identifier', 'url', 'requestParams', 'pageParam', 'pageSizeParam', 'startParam', 'countParam'];
	
	/**
	 * 数据源
	 * 缓存：数据源保存缓存，按照Key-Value的方式对每条数据进行存储，key为数据的index
	 * 持久化：使用localStorage，进行持久化，缓存会序列化成字符串形式存储
	 * TODO: 先用ajax实现原型，有需要再抽取父类
	 */
	//
	var DataSource = function(options){

		var defaults = {
			pageParam: 'page', pageSizeParam: 'pageSize',
			startParam: 'start', countParam: 'count'
		};
		var desiredOptions = _.pick(options, dsOptions);
		this.options = _.extend(defaults, desiredOptions);

		this._initCache();
	}

	DataSource.extend = Backbone.View.extend;

	_.extend(DataSource.prototype, {

		clear: function(){
			this.cache = {};
			this._persist();
		},

		get: function(key){
			return this.cache[key];
		},

		/**
		 * 初始化缓存
		 */
		_initCache: function(){
			var localstorage = window.localStorage['datasource-' + this.options.identifier];
			if (localstorage) {
				this.cache = JSON.parse(localstorage);
			} else {
				this.cache = {};
			}
		},

		/**
		 * 持久化缓存
		 */
		_persist: function(){
			console.log('数据源[%s]持久化...', this.options.identifier);
			window.localStorage['datasource-' + this.options.identifier] = JSON.stringify(this.cache);
		},

		_loadFromCache: function(start, count, callback){

			var me = this;

			//所有的缓存key，拼成数组
			var indexs = [];
			for (var i = start; i < start + count; i++) indexs.push(i);

			//检查所有请求数据都在cache中（检查key）
			var not_required_data_all_in_cache = _.some(indexs, function(value){ 
				return !_.has(me.cache, value);
			});

			//如果所有请求数据均在缓冲中，直接pick出来，否则发起请求
			if (not_required_data_all_in_cache) {
				console.log('datasource.cache.miss: ' + start + '~' + count);
				callback(null);
			} else {
				console.log('datasource.cache.hit: ' + start + '~' + count);
				var cachedData = _.chain(this.cache).pick(indexs).map(function(v, k){
					return me.cache[k];
				}).value();
				callback(cachedData);
			}
		},

		/**
			* 需在构造函数传入pageSize
			*/
		loadData: function(page, pageSize, success, fail){

			var me = this;
			
			this._loadFromCache(page * pageSize, pageSize, function(data){
				if (data) {
					if (success) success(data);
				} else {
					var data = {};
					data[me.options.pageParam] = page;
					data[me.options.pageSizeParam] = pageSize;

					me._ajaxLoadData({
						url: me.options.url,
						data: _.extend(data, me.options.requestParams),
						success: function(data){
							//update cache
							_.each(data.data, function(element, index){
								me.cache[page * pageSize + index] = element;
							});
							me._persist();
							//callback
							if (success) success(data.data);
						},
						fail: fail
					});
				}
			});//try to load from cache

		},

		//simple ajax wrap
		_ajaxLoadData: function(options){

			$.ajax({
				url: options.url,
				type: 'GET',
				dataType: "json",
				data: options.data,
				timeout: 5000,
				success: function(data) {
					options.success(data);
				},
				error: function(xhr, status) {
					options.fail(xhr, status);
				}
			});
		},

		parseResponse: function(response){
			
		}

	});

	return DataSource;
});