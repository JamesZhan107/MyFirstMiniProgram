var postsData = require("../../../data/posts-data.js")
var app = getApp();

Page({

  data: {
    isPlayingMusic:false
  },

  onLoad: function (options) {
    var postid = options.id;
    var postData = postsData.postList[postid];
    this.data.currentPostid = postid;
    
    this.setData({
      postData: postData,
    });

    //获取缓存posts_Collected的值
    var posts = wx.getStorageSync("posts_Collected");
    if(posts){
      var post = posts[postid];
      this.setData({
        collected: post
      })
    }
    else{
      var postsCollected={};
      postsCollected[postid] = false;
      wx.setStorageSync("posts_Collected", postsCollected); 
    }

    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicId ===postid){
      this.setData({
        isPlayingMusic:true,
      })
    }
    this.setMusicMonitor();

  },

  setMusicMonitor:function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicId = that.currentPostid
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicId = null
    });
  },

  onTap:function(){
    //获取postCollected值
    var postsCollected = wx.getStorageSync("posts_Collected");
    var postCollected = postsCollected[this.data.currentPostid];
    //对postCollected值取反，并设为当前页面的postCollected
    postCollected = !postCollected;
    postsCollected[this.data.currentPostid] = postCollected;
    //保存postsCollected
    wx.setStorageSync("posts_Collected", postsCollected);
    //将取反后的postCollected发送至前端
    this.setData({
      collected:postCollected
    })

    wx.showToast({
      title: postCollected?'收藏成功':"取消成功",
      duration:500
    })

  },

  onShareTap:function(event){
    var itemList=[
      "分享到朋友圈",
      "分享给好友",
      "分享到微博",
    ]

    wx.showActionSheet({
      itemList: itemList,
      itemColor:"#fcf803",
      success:function(res){
        wx.showModal({
          title: '用户'+itemList[res.tapIndex],
          content: "接口待补全！"
        })
      }
    })
  },

  onMusicTap:function(){
    var isPlayingMusic = this.data.isPlayingMusic;
    var currentPostId = this.data.currentPostid;
    var postdata = postsData.postList[currentPostId];
    if(isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }
    else{
      var currentPostId = this.data.currentPostid;
      wx.playBackgroundAudio({
        dataUrl: postdata.music.url,
        title: postdata.music.title,
        coverImgUrl: postdata.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })     
    }

  },

})