define(['underscore', 'jquery', 'butterfly/extend'], function(_, $, extend){

	var dsOptions = ['identifier', 'url', 'requestParams', 'pageParam', 'pageSizeParam', 'startParam', 'countParam', 'storage'];
	
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
			startParam: 'start', countParam: 'count',
			storage: 'session'
		};
		var desiredOptions = _.pick(options, dsOptions);
		this.options = _.extend(defaults, desiredOptions);

		this._initCache();
	}

	DataSource.extend = extend;

	_.extend(DataSource.prototype, {

		clear: function(){
			this.finish = false;
			this.cache = [];
			this.persist();
		},

		get: function(key){
			return this.cache[key];
		},

		//key or index
		set: function(key, value){
			this.cache[key] = value;
		},

		size: function(){
			return this.cache.length;
		},

		/**
		 * 初始化缓存
		 */
		_initCache: function(){
			var localstorage;
			switch(this.options.storage) {
				case 'local':
					localstorage = window.localStorage['datasource-' + this.options.identifier];
					break;
				case 'session':
					localstorage = window.sessionStorage['datasource-' + this.options.identifier];
					break;
				case 'none':
					localstorage = null;
					break;
			}
			
			if (localstorage) {
				this.cache = JSON.parse(localstorage);
			} else {
				this.cache = [];
			}
		},

		/**
		 * 持久化缓存
		 */
		persist: function(){
			console.log('数据源[%s]持久化，介质[%s]', this.options.identifier, this.options.storage);
			switch(this.options.storage) {
				case 'local':
					window.localStorage['datasource-' + this.options.identifier] = JSON.stringify(this.cache);
					break;
				case 'session':
					window.sessionStorage['datasource-' + this.options.identifier] = JSON.stringify(this.cache);
					break;
				case 'none':
					break;
			}
		},

		//按照序号缓存（而非页码）
		loadDataFromCache: function(start, count){
			var me = this;

			//所有的缓存key，下标
			var indexs = _.range(start, start + count);

			//有任何一条数据不在缓存中（根据下标获取判断）
			var any_not_in = _.any(indexs, function(index){
				return me.cache[index] == undefined;
			});

			if (any_not_in) {
				console.log('datasource.cache.miss: ' + start + '~' + count);
				return null;
			} else {
				console.log('datasource.cache.hit: ' + start + '~' + count);
				var cachedData = this.cache.slice(start, start + count);
				return cachedData;
			}
		},

		/**
			* 需在构造函数传入pageSize
			*/
		loadData: function(page, pageSize, success, fail){

			var me = this;
			
			var cachedData = this.loadDataFromCache(page * pageSize, pageSize);
			if (cachedData) {
				if (success) success(cachedData);
			} else {
				var data = {};
				data[me.options.pageParam] = page;
				data[me.options.pageSizeParam] = pageSize;

				me.ajaxLoadData({
					url: me.options.url,
					data: _.extend(data, me.options.requestParams),
					success: function(resultArray){
						//update 
						_.each(resultArray, function(element, index){
							me.set(page * pageSize + index, element);
						});
						me.persist();
						//callback
						if (success) success(resultArray, me.finish);
					},
					fail: fail
				});
			}

		},

		setRequestParams: function(params) {
			this.options.requestParams = params;
		},

		//simple ajax wrap
		//options.data
		//options.success
		//options.fail
		ajaxLoadData: function(options){

			var me = this;
			$.ajax({
				url: options.url,
				type: 'GET',
				dataType: "json",
				data: options.data,
				timeout: 5000,
				success: function(response) {
					options.success(response);
				},
				error: function(xhr, status) {
					options.fail(xhr, status);
				}
			});
		},

		setFinish: function(){
			this.finish = true;
		}

	});

	return DataSource;
});
