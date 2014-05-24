define(['require', 'underscore', './container', 'butterfly'], 
	function(require, _, Container, Butterfly){
  
  return Container.extend({

  	initialize: function(options){
  		var routeElements = this.el.querySelectorAll('[data-route]');
  		this.routes = _.foldl(routeElements, function(memo, el){
  			memo[el.getAttribute('data-path')] = el.getAttribute('data-route');
  			return memo;
  		}, {});
  	},

		route: function(paths, params){
			var me = this;
			
			var array = paths.split('/');
			var target = this.routes[array.shift()];

			if (!target) return;

			Butterfly.ViewLoader.loadView(target, function(viewObject){
				//replace contentView
				if (me.contentView) {
					me.contentView.hide();
					me.contentView.remove();
				}
				
				me.contentView = viewObject;

				viewObject.render();
				me.el.querySelector("[data-role='tab-content']").appendChild(viewObject.el);
				viewObject.show();

				if (array.length > 0) viewObject.route(array.join('/'), params);
			});
		}
		
  });
});
