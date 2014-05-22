define(['butterfly/container'], function(Container){

	return Container.extend({

		events: {
			'click #switch': 'switchContent'
		},

		initialize: function(){
			Container.prototype.initialize.call(this, arguments);
			console.log('main.index init~~~~~');
		},

		switchContent: function(){
			// Butterfly.router.on('route', function(path, params){
			// 	console.log('route event: %s | %s', path, params);
			// });
			this.content = (this.content == '#hall' ? '#sales' : '#hall');
			this.setActiveView(this.content);
		}

	});
});