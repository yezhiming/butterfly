define(['./DataSource'], function(DS){

	return DS.extend(function(){
		
		loadData: function(start, count, success, fail){

			var me = this;
			var startParam = this.options.startParam;
			var countParam = this.options.countParam;

			var cachedData = this._loadFromCache(page * pageSize, pageSize);
			if (cachedData) {
				if (success) success(cachedData);
			} else {
				me._ajaxLoadData({
					url: me.options.url,
					data: _.extend({startParam: start, countParam: count}, me.options.requestParams),
					success: function(resultArray){
						//update cache
						_.each(resultArray, function(element, index){
							me.cache[index] = element;
						});
						me._persist();
						//callback
						if (success) success(resultArray);
					},
					fail: fail
				});
			}

		}//loadData

	});
});