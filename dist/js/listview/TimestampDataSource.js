define(['./DataSource'], function(DS){

	return DS.extend(function(){
		
		loadData: function(start, count, success, fail){

			var me = this;
			var startParam = this.options.startParam;
			var countParam = this.options.countParam;

			this._loadFromCache(start, count, function(data){
				if (data) {
					if (success) success(data);
				} else {
					me._ajaxLoadData({
						url: me.options.url,
						data: _.extend({startParam: start, countParam: count}, me.options.requestParams),
						success: function(data){
							//update cache
							_.each(data.data, function(element, index){
								me.cache[index] = element;
							});
							me._persist();
							//callback
							if (success) success(data.data);
						},
						fail: fail
					});
				}
			});//try to load from cache

		}//loadData

	});
});