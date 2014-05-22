define(['./container'], function(Container){
  
  return Container.extend({

		route: function(paths, params){
			var array = paths.split('/');
			var route = array.shift();
			var subview = this.routes[route];

			if (!subview) {
				this.subviews.forEach(function(subview){
					subview.el.classList.remove('active');
				});
				subview.el.classList.add('active');

				if (array.length > 0) subview.route(array.join('/'));
			}
		}
		
  });
});
