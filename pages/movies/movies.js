var app=getApp();
var util = require("../../utils/utils.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerShow:true,
    searchPannelShow:false
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
    console.log(readyData);
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

    })
  }
})