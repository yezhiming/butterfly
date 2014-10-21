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

      var me = this;

      var opts = _.chain(listviewOptions)

      //get attribute value, [name, value] array
      .map(function(option){
        return [option, me.el.getAttribute('data-' + option)];
      })
      //turn [[name, value], [name, value], ...] array to object
      .object()

      //override by options
      .defaults(_.pick(options, listviewOptions))

      //eval
      .map(function(value, key){
        return [key, me.evaluate(value)];
      })
      .object()

      //get final value
      .value();

      
    },

    //evaluate option value, either a string or an expression
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
