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
			
			var target = this.routes[paths];

			if (!target) return;

			Butterfly.ViewLoader.loadView(target, function(viewObject){
				//replace contentView
				if (me.contentView) me.contentView.remove();
				me.contentView = viewObject;
				//render new contentView
				var content = me.el.querySelector("[data-role='tab-content']");
				viewObject.render();
				content.appendChild(viewObject.el);
			});
		}
		
  });
});
