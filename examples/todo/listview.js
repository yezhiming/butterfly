define(['butterfly/view'], function(View){

  var listviewOptions = ['autoLoad' ,'itemTemplate', 'itemClass', 'collection', 'pageSize'];

  return View.extend({
    events: {
      "click .loadmore": "onLoadMore",
      "click li": "onRowSelect"
    },

    //parse params from options or from el attributes
    initialize: function(options){

      View.prototype.initialize.apply(this, arguments);

      var optionsInUpperCase = _.map(listviewOptions, function(opt){
        return opt.toUpperCase();
      });

      var me = this;
      //pick from el first
      var opts = _.chain(this.el.attributes)
      //
      .filter(function(attr){
        //remove 'data-' initial and uppercase to attribute name
        return optionsInUpperCase.indexOf(attr.name.substr(5).toUpperCase()) != -1;
      })
      //turn every attribute into [name, value] array
      .map(function(attr){
        return [attr.name.substr(5), attr.value];
      })
      //turn [[name, value], [name, value], ...] array to object
      .object()
      //override by options
      .defaults(_.pick(options, listviewOptions))
      //eval
      .map(function(opt){
        return me.evaluate(opt);
      })
      //get final value
      .value();
    },

    evaluate: function(opt){
      if (typeof opt == 'string' && opt.match(/\{.*\}/)) {

        opt = opt.replace(/^\{/, '').replace(/\}$/, '');
        var fn = new Function("obj", "var result; with(obj){result = " + opt + ";} return result;");
        return fn(this);

      } else {
        return opt;
      }
    },

    onLoadMore: function(event) {
      var me = this;
      var loadmoreButton = event.currentTarget;
    }

  });
});
