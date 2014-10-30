define(['backbone'], function(Backbone){

  var Tasks = Backbone.Collection.extend({
    //接口地址
    url: '/api/tasks',
    queryParams: '',
    //当前页码
    page: 0,
    pageSize: 10,

    //翻页时，是否删除以前的（上一页）内容
    continuous: true,

    //覆盖此方法，在响应中解析出总页数等信息
    parse: function(response){
      return response.records;
    },

    search: function(options){

    },

    //
    // fetch first page with {reset: true} options
    //
    fetchPage: function(page){
      console.log('fetch page: %d', page);

      this.fetch({
        remove: !this.continuous || page == 0,
        reset: page == 0,
        data: {page: page, pageSize: this.pageSize},
        success: _.bind(this.onLoad, this),
      	error: _.bind(this.onError, this)
      });
    },

    fetchFirstPage: function(){
      this.page = 0;
      this.fetchPage(this.page);
    },

    fetchNextPage: function(){
      this.fetchPage(this.page + 1);
    },

    onLoad: function(collection, response, options){
      console.log('on load');

      if (response.page < response.pageCount - 1 || response.records.length == 0) {

        this.page = response.page;
      } else {

        this.trigger('end', this);
      }
    },

    onError: function(collection, response, options){
      console.log('on error');

      this.trigger('error', this);
    }
  });

  //遗留系统，响应里没有总页数，当前页等信息，需要自行推断
  var LegacyTasks = Tasks.extend({

    //legacy server API
    parse: function(response){
      return response;
    },

    onLoad: function(collection, response, options){
      console.log('on load');

      if (response.length == options.data.pageSize) {
        //响应有数据，且与pageSize一样，足一页，页码加一（但也可能刚好够一页，下一页为数据长度为0）
        this.page++;
      } else if (response.length.length > 0) {
        //有数据，但不足一页，页码加一，并触发完成事件
        this.page++;
        this.trigger('end', this);
      } else {
        //直接触发完成事件
        this.trigger('end', this);
      }
    },
  });

  return Tasks;
});
