define(['backbone'], function(Backbone){

  var Tasks = Backbone.Collection.extend({
    //接口地址
    url: '/api/tasks',
    queryParams: '',
    page: 0,
    pageSize: 10,

    //翻页时，是否删除以前的（上一页）内容
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
        remove: !this.continuous,
        reset: page == 0,
        data: {page: page, pageSize: this.pageSize},
        success: this.onLoad,
      	error: this.onError
      });
    },

    fetchFirstPage: function(){
      this.page = 0;
      this.fetchPage(this.page);
    },

    fetchNextPage: function(){
      this.fetchPage(++this.page);
    },
    
    onLoad: function(collection, response, options){
      console.log('on load');
    },

    onError: function(collection, response, options){
      console.log('on error');
    }
  });

  return Tasks;
});
