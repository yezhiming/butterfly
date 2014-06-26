define(['butterfly/extend'], function(extend){

	var Task = function(){

	}

	_.extend(Task.prototype, {

		//执行任务
		execute: function(success, fail){
			//call success callback immediately
			success();
		},

		//终止任务
		abort: function(){

		}
	});

	Task.extend = extend;

	return Task;
});