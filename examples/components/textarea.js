define([
    'butterfly/view', 
    'css!./textarea', 
    'jquery', 
    'iscroll',
    'autosize'], 
    function(View, No, $, IScroll){

	return View.extend({
		events: {
			"click #action": "action"
		},

		action: function(){
			this.s.refresh();
		},

		onShow: function(){
			console.log('show');
            this.$('#content-area').autosize();
		}
	});
});