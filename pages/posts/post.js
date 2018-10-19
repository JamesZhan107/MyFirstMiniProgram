var postData = require("../../data/posts-data.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化
    //方式一
    //this.data.posts_key = postData.postList

    //方式二
    this.setData({
      posts_key: postData.postList,
    });
  },

  onPostTap: function (event) {
    var postid=event.currentTarget.dataset.postid;
    //跳转至子级页面，隐藏父级页面
     wx.navigateTo({
       url: 'post-detail/post-detail?id=' + postid
     });
    
  },

//冒泡与非冒泡抓取
  // onSwiperItemTap: function (event) {
  //   var postid = event.currentTarget.dataset.postid;
  //   //跳转至子级页面，隐藏父级页面
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postid
  //   });
  // },

// target指的是当前点击的组件，currentTarget指的是事件捕获的组件
  onSwiperTap:function(event){
    var postid = event.target.dataset.postid;
    //跳转至子级页面，隐藏父级页面
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid
    });
  },

})