define(['./view', 'underscore'], function(View, _){
	return View.extend({

		stack: [],

		initialize: function(){
			
		},

		push: function(view){
			//当前最顶
			var firstView = _.last(this.stack);

			this.stack.push(view);
			//移除
			if (firstView) firstView.hide();
			if (firstView) firstView.remove();

			//添加到本container
			view.render(); this.el.appendChild(view.el);

			view.show();
		},

		pop: function(){
			if (this.stack.length <= 0) return;

			var firstView = this.stack.pop();
			var secondView = _.last(this.stack);

			topView.willDisappear();
			secondView.willAppear();
			
			topView.remove();

			topView.didDisappear();
			secondView.didAppear();
		},

		addSubview: function(view){
			this.push(view);
		}
	});
});