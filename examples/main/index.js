define(['butterfly/container'], function(View){

	return View.extend({

		events: {
			'click #switch': 'switchContent'
		},

		initialize: function(){
			View.prototype.initialize.call(this, arguments);
			console.log('main.index init~~~~~');
			
		},

		switchContent: function(){
			// Butterfly.router.on('route', function(path, params){
			// 	console.log('route event: %s | %s', path, params);
			// });
		}

	});
});