define(['backbone'], function(Backbone){

  var Tasks = Backbone.Collection.extend({
    url: '/api/tasks',

    search: function(options){

    },

    fetchPage: function(page){
      this.fetch();
    }
  });

  return Tasks;
});
