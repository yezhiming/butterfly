define(['./container'], function(Container){

	return Container.extend({

		route: function(paths, params){
			
			if (!paths) return;

			var me = this;
			Butterfly.ViewLoader.loadView(paths, function(viewObject){
				//replace contentView
				if (me.contentView) {
					me.contentView.hide();
					me.contentView.remove();
				}
				
				me.contentView = viewObject;

				viewObject.render();
				me.el.appendChild(viewObject.el);
				viewObject.show();
			});
		}
	});
});