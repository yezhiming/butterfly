define([
	'jquery',
	'butterfly/view', 
	'butterfly/task/Task', 
	'butterfly/task/TaskQueue'
	], function($, View, Task, TaskQueue){

	var RequireJSTask = Task.extend({

		constructor: function(module){
			this.module = module;
		},

		execute: function(success, fail){
			require([this.module], success, fail);
		}
	});

	return View.extend({

		render: function(){
			console.log('task view render');

			new TaskQueue()
			.add(new RequireJSTask('jquery'))
			.add(new RequireJSTask('underscore'))
			.add(new RequireJSTask('backbone'))
			.success(function(result){
				alert('success');
			})
			.fail(function(){
				alert('fail');
			})
			.execute();
		}

	});
});