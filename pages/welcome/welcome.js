Page({
  onTap:function(){
    //跳转至子级页面，隐藏父级页面
    // wx.navigateTo({
    //   url: '../posts/post',
    // });

    //跳转至另一个平行页面，关闭当前页面
    // wx.redictTo({
    //   url: '../posts/post',
    // })

    //跳转的页面位于tabBar中，就需要用switchtab进行跳转
    wx.switchTab({
      url: '../movies/movies',
    })
  },


})