define(['underscore'], function(_){
	
	var TaskQueue = function(){
		this.queue = [];
		//empty function
		this.onSuccess = function(){};
		this.onFail = function(){};
	}

	_.extend(TaskQueue.prototype, {

		add: function(task){
			task.index = this.queue.length;
			this.queue.push(task);
			return this;
		},

		success: function(callback){
			this.onSuccess = callback;
			return this;
		},

		fail: function(callback){
			this.onFail = callback;
			return this;
		},

		execute: function(){

			var toBeDone = this.queue.length;
			var resultArray = [];

			var me = this;
			this.queue.forEach(function(task, i){
				
				task.execute(function(result){
					//collect result
					resultArray[i] = result;
					//all is done
					if (--toBeDone == 0) {
						me.onSuccess(resultArray);
					};
				}, function(err){
					me.abort();
					me.onFail(err);
				});
			});
		},

		abort: function(){
			this.queue.forEach(function(task){
				if (task.abort) task.abort();
			});
		}
	});

	return TaskQueue;
});