define(['butterfly/view', 'backbone'], function(View, Backbone){

	return View.extend({

		initialize: function(options){
			View.prototype.initialize.call(this, options);

			this.el.classList.add('container');
			var routes = this.el.getAttribute('data-routes');

			//todo: register router
			Butterfly.router.on('route', function(path, params){
				console.log('route event: %s | %s', path, params);
				
			});

			// Backbone.history.stop();

			var mr = Backbone.Router.extend({
				routes: {
					"container/1": "route1"
				},
				route1: function(){
					console.log('route1');
				}
			});

			new mr();

			// Backbone.history.start();
		}

		// addSubview: function(view){
		// 	console.log('add [%s] to [%s]', view.el.id, this.el.id);

		// 	//当前最顶
		// 	var firstView = _.last(this.subviews);

		// 	this.subviews.push(view);

		// 	//移除
		// 	if (firstView) {
		// 		firstView.hide();
		// 		// firstView.remove();
		// 	}

		// 	// //添加到本container
		// 	view.render(); this.el.appendChild(view.el);

		// 	view.show();
		// }
	});
});