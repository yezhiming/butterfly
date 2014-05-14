define(['butterfly', 'butterfly/view'], function(Butterfly, View){
	return View.extend({
		initialize: function(){
			this.stack = [];
			this.view = null;
		},
		push: function(view){
			var me = this;
			Butterfly.ViewLoader.loadView(view, function(viewObject){
				if (me.view) {me.view.remove();};
				me.view = viewObject;
				me.el.appendChild(viewObject.el);
			});
		}
	});
});