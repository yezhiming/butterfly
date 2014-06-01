define(['butterfly/view', 'spin'], function(View, Spinner){

	return View.extend({
		render: function(){
			new Spinner().spin(this.el);
		}
	});
});