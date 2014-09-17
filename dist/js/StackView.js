define(['butterfly/view'], function(View){

  //show only contain one direct subview
  return View.extend({

    initialize: function(options){
      View.prototype.initialize.apply(this, arguments);

      // stack to store the views, [{path: 'a', view: a}, {path: 'b', view: b}]
      this.stack = [];
      this.baseZIndex = 100;

      // using this variable to indicate this container has routed once already
      // to stop the animation from first route
      // this check is no needed for normal case
      this.routedOnce = false;
    },

    render: function(){
      _.each(this.stack, function(item){
        item.view.render();
      });
    },

    onShow: function(options){
      var currentView = this.stack[this.stack.length -1].view;
      currentView.show(options);
    },

    addSubview: function(view){
      View.prototype.addSubview.apply(this, arguments);
      view.$el.css({
        'position': 'absolute',
        'top': '0px',
        'bottom': '0px',
        'width': '100%',
        'z-index': this.baseZIndex++
      });

      this.stack.push({path: null, view: this.subviews[0]});
    },

    route: function(paths, options){
      var me = this;

      if (this.stack.length == 1 && !paths) {
        this.routedOnce = true;
        return;
      }

      // check is this route is intent to go back
      var goingBack = this.stack.length >= 2 && (this.stack[this.stack.length - 2].path == paths);
      // 2 top views in the stack
      var currentView = this.stack[this.stack.length -1].view;
      var nextView = this.stack.length >= 2 ? this.stack[this.stack.length -2].view : null;

      if (goingBack) {

        this.stack.pop();
        this.baseZIndex--;

        nextView.animateSlideInLeft();

        currentView.animateSlideOutRight(function(){
          //hide & remote top
          currentView.hide();
          currentView.remove();
          //show next
          nextView.show(options);
        });

      } else {

        //load view using butterfly plugin
        require(['view!' + paths], function(ViewClass){

          var newView = new ViewClass();
          newView.$el.css({
            'position': 'absolute',
            'top': '0px',
            'bottom': '0px',
            'width': '100%',
            'z-index': me.baseZIndex++
          });

          if (currentView) {
            currentView.hide();
            // currentView.remove();
          }

          newView.render();
          me.el.appendChild(newView.el);
          newView.show(options);

          //如果是第一次route，则不显示动画
          if (me.routedOnce) {
            currentView.animateSlideOutLeft();
            newView.animateSlideInRight();
          }

          me.stack.push({path: paths, view: newView});

          me.routedOnce = true;
        }, function(err){
          //TODO: without trigger
          window.history.back();
          alert('页面加载失败');
        });

      }


    }
  });
});
