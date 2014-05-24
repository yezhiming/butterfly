define(['butterfly/view'], function(View){

	return View.extend({
		initialize: function(){
			View.prototype.initialize.call(this, arguments);
			console.log('innerview init');
		}
	});
});