define(['butterfly'], function(Butterfly){

	return Butterfly.Router.extend({
		routes: {
		},

		hall: function(page){
			mainContainer.navigate('/sales/dashboard');

			var view = mainContainer.findMapping('/sales');
			view.navigate('/dashboard');
		},
	});
});