// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require("../../../utils/utils.js");

Page({

  data: {
    navigateTitle:"",
    requestUrl: "",
    totalCount:0,
    isEmpty:true,
  },

  // 页面之间传递参数的方式有四种：
  // 1、利用全局变量
  // 2、利用缓存
  // 3、利用URL传参（本次使用的就是这个）
  // 4、利用事件
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch(category){
      case "正在上映的电影-北京":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映的电影":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣电影Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDouban);
  },

  processDouban: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      };
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
        listTitle: moviesDouban.title,
      };
      movies.push(temp);
    }
    var totalMovies = {};

    //如果要绑定新加载的数据，那么需要和旧有的数据合并在一起
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies)
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies:totalMovies,
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx,wx.stopPullDownRefresh();
  },

  //动态设定导航栏，设置UI页面相关内容，要在onReady或之后设置
  onReady:function(event){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle.toString().substring(0, 4),
    });
  },

  onScrollLower:function(event){
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDouban);
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh:function(event){
    var refreshtUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies={};
    this.data.isEmpty = true;
    util.http(refreshtUrl, this.processDouban);
    wx.showNavigationBarLoading()
  }

})