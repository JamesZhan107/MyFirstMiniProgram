var app=getApp();
var util = require("../../utils/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerShow:true,
    searchPannelShow:false,
    searchtUrl:"",
    totalCount: 0,
    isEmpty: true,
    totalMoviesLength:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    var inTheatersUrl = app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    
    this.getMovieListData(inTheatersUrl,"inTheaters");
    this.getMovieListData(comingSoonUrl,"comingSoon");
    this.getMovieListData(top250Url,"top250");
  },

  getMovieListData:function(url,settedKey){
    var that = this;
    wx.request({
      url: url,
      header: {
        "content-type": "application/xml"
      },
      success: function (res) {
        that.processDouban(res.data, settedKey);
      },
      fail: function (error) {
        console.log(error)
      },
    })
  },

  processDouban: function (moviesDouban, settedKey){
    var movies = [];
    for(var idx in moviesDouban.subjects){
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if(title.length >= 6){
        title = title.substring(0,6)+"...";
      };
      var temp = {
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
        listTitle:moviesDouban.title,
      };
      movies.push(temp);
    }

    //此处十分重要
    var readyData = {};
    readyData[settedKey] ={
      movies:movies,
    };
    this.setData(readyData);
    //上行代码原理上相当于：
    // this.setData({
    //   inTheaters:movies
    // })
    //此处的inTheaters不能用settedKey代替，会被默认为一个新的变量
  },

  onMoreTap:function(event){
      var category = event.currentTarget.dataset.category;
      wx.navigateTo({
        url: 'more-movie/more-movie?category='+category,
      })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPannelShow: true,
    })
  },

  onCancelImgTap:function(event){
    this.setData({
      containerShow: true,
      searchPannelShow: false,
      movies:[]
    })
  },

  onBindconfirm:function(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase+"/v2/movie/search?q=" + text ;
    this.data.searchtUrl = searchUrl;
    util.http(searchUrl, this.searchProcessDouban)
  },

  onScrollLower: function (event) {
    var totalMoviesNum = this.data.totalMoviesLength;
    console.log(totalMoviesNum)
    var nextUrl = this.data.searchtUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.searchProcessDouban);
    wx.showNavigationBarLoading()
  },

  searchProcessDouban: function (moviesDouban) {
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
    var totalMovies={};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.data.totalMoviesLength = totalMovies.length;
    this.setData({
      movies: totalMovies,
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
  },

})