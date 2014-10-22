define(['backbone'], function(Backbone){

  var Tasks = Backbone.Collection.extend({
    //接口地址
    url: '/api/tasks',
    queryParams: '',
    page: 0,
    pageSize: 10,

    //翻页时，是否删除以前的（上一页）内容
    remove: true,
    continuous: true,

    //可以通过覆盖这个方法，在响应中解析出总页数等信息
    parse: function(response){
      return response;
    },

    search: function(options){

    },

    //
    // fetch first page with {reset: true} options
    //
    fetchPage: function(page){
      this.fetch({
        remove: this.remove,
        reset: page == 0,
        data: {page: page, pageSize: pageSize}
      });
    },

    fetchNextPage: function(){

    }
  });

  return Tasks;
});
