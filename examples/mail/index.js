define(['butterfly/view'], function(View){

	return View.extend({

		initialize: function(){
			View.prototype.initialize.call(this, arguments);
			console.log('mail.index init~~~~~');
		},

		render: function(){
			console.log('render');
		}
	});
});