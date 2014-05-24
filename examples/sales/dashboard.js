define(['butterfly/view'], function(View){
	return View.extend({
		events: {
			"click #clickme": function(){
				alert('click');
			}
		}
	});
});