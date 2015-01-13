(function(root, factory){

  if (typeof define === 'function' && define.amd) {
    define(['exports', 'underscore', 'backbone'], function(exports, _, Backbone){
      return factory(root, _, Backbone);
    });

  } else {
    factory(root, root._, root.Backbone);
  }

})(this, function(root, _, Backbone){

  // View Modal Support
  // ==================
  //
  var modal = {

    doModal: function(){
      // TODO: reserved for shadow effect
      // this.mask = document.createElement('div');
      // this.mask.classList.add('butterfly-modal-mask');
      // document.body.appendChild(this.mask);

      this.$el.addClass('butterfly-modal');
      this.$el.appendTo(document.body);
      this.animateSlideInUp();
    },

    dismiss: function(){
      var me = this;
      this.animateSlideOutDown(function(){
        me.$el.removeClass('butterfly-modal');
        me.remove();
      });
    }

  }

  return modal;
});
